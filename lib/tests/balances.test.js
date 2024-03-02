var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as BalancesHandler from '../handlers/balances';
import { getRequestEvent } from './helper';
import { isBase16Address } from '../handlers/utils/validations';
import { lambdaWrapper } from 'serverless-jest-plugin';
const wrapped = lambdaWrapper.wrap(BalancesHandler, { handler: 'handler' });
describe('BalancesHandler', () => {
    const validateBalanceResponseCode200 = (address) => __awaiter(void 0, void 0, void 0, function* () {
        const event = getRequestEvent('GET', JSON.stringify({ address }));
        const response = yield wrapped.run(event);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('success');
        expect(responseBody.success).toBe(true);
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toBe('Successfully retrieved the balance of the contract');
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data).toHaveProperty('address');
        expect(isBase16Address(responseBody.data.address)).toBe(true);
        expect(responseBody.data).toHaveProperty('balance');
        expect(responseBody.data.balance).toMatch(/^\d+$/);
    });
    it('Successfully return the balance of the address with a bech32 address string', () => __awaiter(void 0, void 0, void 0, function* () {
        yield validateBalanceResponseCode200('zil1llhg9synnlhjf8x8x3ulp9x0ren6t0xyvz3tsh');
    }));
    it('Successfully return the balance of the address with a base16 address string', () => __awaiter(void 0, void 0, void 0, function* () {
        yield validateBalanceResponseCode200('0xffee82c0939fef249cc73479f094cf1e67a5bcc4');
    }));
    const validateErrorResponseCode400 = (body, expectedStatusCode, expectedMessageError) => __awaiter(void 0, void 0, void 0, function* () {
        const requestEvent = getRequestEvent('GET', JSON.stringify(body));
        const response = yield wrapped.run(requestEvent);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(expectedStatusCode);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('success');
        expect(responseBody.success).toBe(false);
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toBe('Failed to retrieve the balance of the contract');
        expect(responseBody).toHaveProperty('data');
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toBe(expectedMessageError);
    });
    it('ERROR: Missing \'address\' parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {};
        const expectedStatusCode = 400;
        const expectedMessageError = 'Missing \'address\' parameter';
        yield validateErrorResponseCode400(body, expectedStatusCode, expectedMessageError);
    }));
    it('ERROR: Parameter \'address\' has an invalid format, accepted formats: Bech32 or Base16', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = { address: '0' };
        const expectedStatusCode = 400;
        const expectedMessageError = 'Parameter \'address\' has an invalid format, accepted formats: Bech32 or Base16';
        yield validateErrorResponseCode400(body, expectedStatusCode, expectedMessageError);
    }));
    it('ERROR: Address not found or balance is zero', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = getRequestEvent('GET', JSON.stringify({
            address: 'zil1tym3sy8sary2y3lqy56dx4ej9v7fsxku52gl6z'
        }));
        const response = yield wrapped.run(event);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('success');
        expect(responseBody.success).toBe(false);
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toBe('Failed to retrieve the balance of the contract');
        expect(responseBody).toHaveProperty('data');
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toBe('Address not found or balance is zero');
    }));
});
//# sourceMappingURL=balances.test.js.map