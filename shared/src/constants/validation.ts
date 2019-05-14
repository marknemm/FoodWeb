export class Validation {
  public static readonly EMAIL_REGEX = /^\S+@\S+$/;
  public static readonly POSTAL_CODE_REGEX = /^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/i;
  public static readonly PHONE_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  public static readonly PASSWORD_REGEX = /^.{6,}$/;
  public static readonly ACCOUNT_TYPE_REGEX = /^(Donor|Receiver|Volunteer|Admin)$/;
  public static readonly DONATION_STATUS_REGEX = /^(Unmatched|Matched|Complete)$/;
  public static readonly MONEY_REGEX = /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/;
}
