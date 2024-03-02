var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'source-map-support/register';
import { CustomError } from './utils/customError';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import { isBase16Address } from './utils/validations';
import { fromBech32Address } from '@zilliqa-js/crypto';
const zilliqa = new Zilliqa('https://api.zilliqa.com');
const tokenAddress = 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y';
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = JSON.parse(event.body);
        let { address } = body;
        if (!address) {
            throw new CustomError('Missing \'address\' parameter', 400);
        }
        if (!isBase16Address(address)) {
            try {
                address = fromBech32Address(address);
            }
            catch (_a) {
                throw new CustomError('Parameter \'address\' has an invalid format, accepted formats: Bech32 or Base16', 400);
            }
        }
        const smartContractState = yield zilliqa.blockchain.getSmartContractState(tokenAddress);
        const balances = smartContractState.result.balances;
        const balance = balances[address.toLowerCase()];
        if (!balance) {
            throw new CustomError('Address not found or balance is zero', 404);
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Successfully retrieved the balance of the contract',
                data: {
                    address,
                    balance,
                },
            }),
        };
    }
    catch (error) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({
                success: false,
                message: 'Failed to retrieve the balance of the contract',
                data: {},
                error: error.message,
            }),
        };
    }
});
//# sourceMappingURL=balances.js.map