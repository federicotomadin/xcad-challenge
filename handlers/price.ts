/**
 * Query Prices Proxy API
 * Create an API to query and return the current XCAD price.
 *
 * https://api.coingecko.com/api/v3/simple/price?ids=xcad-network&vs_currencies=usd
 *
 * Use the API above to query the current price for the "xcad-network" token.
 * This price value will need to be displayed on the client-side.
 *
 * Example Response: { 'xcad-network': { usd: 4.78 } }
 */

import axios, { AxiosResponse } from 'axios';
import { PriceApiResponse, PriceEventBody } from '../types/price';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { CustomError } from './utils/customError';
import 'source-map-support/register';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // validate the currency
    const body: PriceEventBody = JSON.parse(event.body) as PriceEventBody;
    const { currency } = body;
    if(!currency || currency.trim() === '' || currency.trim() !== 'usd'){
      throw new CustomError('Missing or invalid value for parameter \'address\'', 400);
    }

    // get the current price of xcad token
    const response: AxiosResponse<PriceApiResponse> = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=xcad-network&vs_currencies=${currency}`
    );
    const price: PriceApiResponse = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Successfully retrieved the price of XCAD',
        data: {
          ...price
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode as number,
      body: JSON.stringify({
        success: false,
        message: 'Failed to retrieve the price of XCAD',
        data: {},
        error: error.message as string,
      }),
    };
  }
};
