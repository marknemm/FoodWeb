import { Response } from 'express';
import { FoodWebError } from '../helpers/response/food-web-error';

/**
 * Handles errors in controllers by logging the error message and sending a user-friendly error response.
 * @param res The express response object.
 * @param err The error.
 */
export function genErrorResponse(res: Response, err: FoodWebError): void {
  _genErrorResponse(res, err);
  console.error(err);
}

/**
 * Handles errors in controllers by sending a user-friendly error response and rethrowing the error.
 * @param res The express response object.
 * @param err The error.
 * @throws The input err.
 */
export function genErrorResponseRethrow(res: Response, err: FoodWebError): void {
  _genErrorResponse(res, err);
  throw err;
}

/**
 * Generates and sends a user-friendly error response to the client.
 * @param res The express response object.
 * @param err The error.
 */
function _genErrorResponse(res: Response, err: FoodWebError): void {
  // If the given error object has a status field defined, then it is already a user-friendly FoodWebError object.
  const message: string = (err.status !== undefined) ? err.message : 'An unexpected error occured';
  const status: number = (err.status !== undefined) ? err.status : 500;
  res.status(status).send({ message });
}
