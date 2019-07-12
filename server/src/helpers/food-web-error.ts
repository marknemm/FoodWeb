/**
 * Custom FoodWebError which adds status code to standard error.
 */
export class FoodWebError extends Error {
  /**
   * @param message The error message.
   * @param status The status to send back to the server (defaults to 500).
   */
  constructor(
    message = '',
    public status = 500
  ) {
    super(message);
  }
}
