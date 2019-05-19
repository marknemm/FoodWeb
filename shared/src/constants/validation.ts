export class Validation {
  public static readonly EMAIL_REGEX = /^\S+@\S+$/;
  public static readonly POSTAL_CODE_REGEX = /^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/i;
  public static readonly PHONE_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  public static readonly PASSWORD_REGEX = /^.{6,}$/;
  public static readonly ACCOUNT_TYPE_REGEX = /^(Donor|Receiver|Volunteer|Admin)$/;
  public static readonly DONATION_STATUS_REGEX = /^(Unmatched|Matched|Complete)$/;
  public static readonly MONEY_REGEX = /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/;
  public static readonly DATE_REGEX = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
}
