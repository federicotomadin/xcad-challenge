var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as PriceHandler from '../handlers/price';
import { getRequestEvent } from './helper';
import { lambdaWrapper } from 'serverless-jest-plugin';
const wrapped = lambdaWrapper.wrap(PriceHandler, { handler: 'handler' });
describe('PriceHandler', () => {
    it('Successfully return the current price of XCAD', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = getRequestEvent('POST', JSON.stringify({
            currency: 'usd',
        }));
        const response = yield wrapped.run(event);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('success');
        expect(responseBody.success).toBe(true);
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toBe('Successfully retrieved the price of XCAD');
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data).toHaveProperty('xcad-network');
        expect(responseBody.data['xcad-network']).toHaveProperty('usd');
        expect(responseBody.data['xcad-network'].usd).toEqual(expect.any(Number));
    }));
    const validateErrorResponseCode400 = (body, expectedStatusCode, expectedErrorMessage) => __awaiter(void 0, void 0, void 0, function* () {
        const requestEvent = getRequestEvent('POST', JSON.stringify(body));
        const response = yield wrapped.run(requestEvent);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(expectedStatusCode);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('success');
        expect(responseBody.success).toBe(false);
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toBe('Failed to retrieve the price of XCAD');
        expect(responseBody).toHaveProperty('data');
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toBe(expectedErrorMessage);
    });
    it('ERROR: No value for \'address\' parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = { currency: '' };
        const expectedStatusCode = 400;
        const expectedErrorMessage = 'Missing or invalid value for parameter \'address\'';
        yield validateErrorResponseCode400(event, expectedStatusCode, expectedErrorMessage);
    }));
    it('ERROR: Invalid value for \'address\' parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = { currency: 'sdf' };
        const expectedStatusCode = 400;
        const expectedErrorMessage = 'Missing or invalid value for parameter \'address\'';
        yield validateErrorResponseCode400(event, expectedStatusCode, expectedErrorMessage);
    }));
    it('ERROR: Missing value for \'address\' parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = {};
        const expectedStatusCode = 400;
        const expectedErrorMessage = 'Missing or invalid value for parameter \'address\'';
        yield validateErrorResponseCode400(event, expectedStatusCode, expectedErrorMessage);
    }));
});
//# sourceMappingURL=price.test.js.map