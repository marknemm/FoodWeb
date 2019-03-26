/**
 * Custom FoodWebError which adds status code to standard error.
 */
export class FoodWebError extends Error {
  constructor(
    message = '',
    public status = 500
  ) {
    super(message);
  }
}
