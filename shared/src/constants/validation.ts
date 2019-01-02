export class Validation {
  public static readonly EMAIL_REGEX = /^\S+@\S+$/;
  public static readonly POSTAL_CODE_REGEX = /^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/i;
  public static readonly PHONE_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  public static readonly PASSWORD_REGEX = /^.{6,}$/;
}
