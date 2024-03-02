import * as PriceHandler from '../handlers/price';
import { PriceResponseBody } from '../types/price';
import { getRequestEvent } from './helper';
import { lambdaWrapper } from 'serverless-jest-plugin';
const wrapped = lambdaWrapper.wrap(PriceHandler, { handler: 'handler' });

describe('PriceHandler', () => {
  // Status Code 200 OK
  it('Successfully return the current price of XCAD', async () => {
    // simulate request
    const event = getRequestEvent('POST', JSON.stringify({
      currency: 'usd',
    }));
    const response = await wrapped.run(event);

    // validate status code
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);

    // validate response body
    const responseBody = JSON.parse(response.body) as PriceResponseBody;
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Successfully retrieved the price of XCAD');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('xcad-network');
    expect(responseBody.data['xcad-network']).toHaveProperty('usd');
    expect(responseBody.data['xcad-network'].usd).toEqual(expect.any(Number));
  });

  // Status Code 400 Bad Request
  const validateErrorResponseCode400 = async (body: any, expectedStatusCode: number, expectedErrorMessage: string) => {
    // simulate the request
    const requestEvent = getRequestEvent('POST', JSON.stringify(body));
    const response = await wrapped.run(requestEvent);

    // validate the status code
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(expectedStatusCode);

    // validate response body
    const responseBody = JSON.parse(response.body) as PriceResponseBody;
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(false);
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Failed to retrieve the price of XCAD');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toBe(expectedErrorMessage);
  };
  it('ERROR: No value for \'address\' parameter', async () => {
    const event = { currency: '' };
    const expectedStatusCode = 400;
    const expectedErrorMessage = 'Missing or invalid value for parameter \'address\'';
    await validateErrorResponseCode400(event, expectedStatusCode, expectedErrorMessage);
  });
  it('ERROR: Invalid value for \'address\' parameter', async () => {
    const event = { currency: 'sdf' };
    const expectedStatusCode = 400;
    const expectedErrorMessage = 'Missing or invalid value for parameter \'address\'';
    await validateErrorResponseCode400(event, expectedStatusCode, expectedErrorMessage);
  });
  it('ERROR: Missing value for \'address\' parameter', async () => {
    const event = {};
    const expectedStatusCode = 400;
    const expectedErrorMessage = 'Missing or invalid value for parameter \'address\'';
    await validateErrorResponseCode400(event, expectedStatusCode, expectedErrorMessage);
  });
});
