import { ResponseBody } from './response';

export interface PriceEventBody {
    currency: string
}

export interface PriceResponseData {
    'xcad-network': {
        usd: number
    }
}

export interface PriceApiResponse {
    price: {
        'xcad-network': {
            usd: number;
        };
    };
}

export interface PriceResponseBody extends ResponseBody{
    data: PriceResponseData
}
