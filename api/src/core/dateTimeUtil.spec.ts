import { DateTimeUtil } from "@api-core/dateTimeUtil";

describe('DateTimeUtil', () => {
    describe('isValidDateOnlyString', () => {
        const validTestDateStringValue = "2023-06-07";
        const wrongPatternDateStringValue = "06-07-2023";
        const wrongStringArgument = "some-wrong-string";
        const invalidFormatDateStringValue = "2003-06-07 03:30:45"; // should not have time.
        const jsDateStringIsInvalid = "Sat Jun 03 2023 00:00:00 GMT-0700 (Pacific Daylight Time)"; // direct js Date() string should not match.

        it (`Date string "${validTestDateStringValue}" is valid ${DateTimeUtil.DATE_FORMAT} string`, async () => {
            expect(DateTimeUtil.isValidDateOnlyString(validTestDateStringValue)).toBe(true);
        });

        it (`Date string "${wrongPatternDateStringValue}" pattern not match ${DateTimeUtil.DATE_FORMAT}`, async () => {
            expect(DateTimeUtil.isValidDateOnlyString(wrongPatternDateStringValue)).toBe(false);
        });

        it (`Date string ${wrongStringArgument} is invalid`, async () => {
            expect(DateTimeUtil.isValidDateOnlyString(wrongStringArgument)).toBe(false);
        });

        it (`Date string ${invalidFormatDateStringValue} is invalid for format ${DateTimeUtil.DATE_FORMAT} `, async () => {
            expect(DateTimeUtil.isValidDateOnlyString(invalidFormatDateStringValue)).toBe(false);
        });

        it (`Date string ${jsDateStringIsInvalid} is invalid for format ${DateTimeUtil.DATE_FORMAT} `, async () => {
            expect(DateTimeUtil.isValidDateOnlyString(jsDateStringIsInvalid)).toBe(false);
        });
    })
});