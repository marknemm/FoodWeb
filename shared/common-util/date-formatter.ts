export class DateFormatter {

    // Pure static class!
    private constructor() { }


    public static dateToMonthDayYearString(date: Date): string {

        if (date != null) {
            // Check to see if we are in fact passed a Date object (may have been stringified in JSON response)!
            if (!(date instanceof Date)) {
                date = new Date(date);
            }

            return (date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear());
        }

        return '';
    }
}
