import { ResponseT } from '../interfaces';

/**
 * Function to return similar response for all the endpoints
 * @param {*} [Response data]
 * @param {boolean} success [true or false]
 * @param {boolean} error   [true or false]
 * @param {string} message  [Response message]
 * @param {number} status  [http status code]
 * @return {object}    [Return the final response]
 */
export const response = <T>({ data, success, error, message, status }: ResponseT<T>) => {
  return {
    success: success,
    error: error,
    message: message,
    status: status,
    data: data,
  };
};

export default response;