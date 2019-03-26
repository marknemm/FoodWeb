import { Response } from 'express';

/**
 * Handles/catches errors in controllers by logging the error and sending a user-friendly error response.
 * @param res The express response object.
 * @param err The error.
 */
export function handleError(res: Response, err: any): void {
  console.error(err);
  // If the given error objecct has a status field defined, then it is already a user-friendly FoodWebError object.
  const message: string = (err.status !== undefined) ? err.message : 'An unexpected error occured';
  const status: number = (err.status !== undefined) ? err.status : 500;
  res.status(status).send({ message });
}
