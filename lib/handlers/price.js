var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { CustomError } from './utils/customError';
import 'source-map-support/register';
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = JSON.parse(event.body);
        const { currency } = body;
        if (!currency || currency.trim() === '' || currency.trim() !== 'usd') {
            throw new CustomError('Missing or invalid value for parameter \'address\'', 400);
        }
        const response = yield axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=xcad-network&vs_currencies=${currency}`);
        const price = response.data;
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Successfully retrieved the price of XCAD',
                data: Object.assign({}, price),
            }),
        };
    }
    catch (error) {
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({
                success: false,
                message: 'Failed to retrieve the price of XCAD',
                data: {},
                error: error.message,
            }),
        };
    }
});
//# sourceMappingURL=price.js.map