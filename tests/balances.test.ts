import * as BalancesHandler from '../handlers/balances';
import {BalanceResponseBody} from '../types/balance';
import {getRequestEvent} from './helper';
import {isBase16Address} from '../handlers/utils/validations';
import {lambdaWrapper} from 'serverless-jest-plugin';
const wrapped = lambdaWrapper.wrap(BalancesHandler, { handler: 'handler' });

describe('BalancesHandler', () => {
  // Status Code 200 OK
  const validateBalanceResponseCode200 = async (address: string) => {
    // simulate the request
    const event = getRequestEvent('GET', JSON.stringify({address}));
    const response = await wrapped.run(event);

    // validate the status code
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);

    // validate response body
    const responseBody: BalanceResponseBody = JSON.parse(response.body) as BalanceResponseBody;
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Successfully retrieved the balance of the contract');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('address');
    expect(isBase16Address(responseBody.data.address)).toBe(true);
    expect(responseBody.data).toHaveProperty('balance');
    expect(responseBody.data.balance).toMatch(/^\d+$/);
  };
  it('Successfully return the balance of the address with a bech32 address string', async () => {
    await validateBalanceResponseCode200('zil1llhg9synnlhjf8x8x3ulp9x0ren6t0xyvz3tsh');
  });

  it('Successfully return the balance of the address with a base16 address string', async () => {
    await validateBalanceResponseCode200('0xffee82c0939fef249cc73479f094cf1e67a5bcc4');
  });

  // Status Code 400 Bad Request
  const validateErrorResponseCode400 = async (body, expectedStatusCode: number, expectedMessageError: string) => {
    // simulate the request
    const requestEvent = getRequestEvent('GET', JSON.stringify(body));
    const response = await wrapped.run(requestEvent);

    // validate the status code
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(expectedStatusCode);

    // validate response body
    const responseBody: BalanceResponseBody = JSON.parse(response.body) as BalanceResponseBody;
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(false);
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Failed to retrieve the balance of the contract');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toBe(expectedMessageError);
  };
  it('ERROR: Missing \'address\' parameter', async () => {
    const body = {};
    const expectedStatusCode = 400;
    const expectedMessageError = 'Missing \'address\' parameter';
    await validateErrorResponseCode400(body, expectedStatusCode, expectedMessageError);
  });
  it('ERROR: Parameter \'address\' has an invalid format, accepted formats: Bech32 or Base16', async () => {
    const body = {address: '0'};
    const expectedStatusCode = 400;
    const expectedMessageError = 'Parameter \'address\' has an invalid format, accepted formats: Bech32 or Base16';
    await validateErrorResponseCode400(body, expectedStatusCode, expectedMessageError);
  });

  // Status Code 404 Not Found
  it('ERROR: Address not found or balance is zero', async () => {
    // simulate the request
    const event = getRequestEvent('GET', JSON.stringify({
      address: 'zil1tym3sy8sary2y3lqy56dx4ej9v7fsxku52gl6z'
    }));
    const response = await wrapped.run(event);

    // validate the status code
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404);

    // validate response body
    const responseBody: BalanceResponseBody = JSON.parse(response.body) as BalanceResponseBody;
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(false);
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Failed to retrieve the balance of the contract');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toBe('Address not found or balance is zero');
  });
});

