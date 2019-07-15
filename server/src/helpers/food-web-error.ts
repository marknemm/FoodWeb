/**
 * Custom FoodWebError which adds status code to standard error.
 * @extends Error
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

/**
 * Custom login required error
 * @extends FoodWebError
 */
export class LoginRequiredError extends FoodWebError {
  constructor() {
    super('Login required', 302);
  }
}
