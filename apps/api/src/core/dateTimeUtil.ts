import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as advancedFormat from 'dayjs/plugin/advancedFormat'

/**
 * This util acts as a wrapper for some date/time munipulation functions, especially for timezone related transform.
 * Current implemented is based on dayjs library. Could change to use libraries if needed.
 * Use this as centralized date/time calculation so that if there is a bug, it is easier to fix all.
 */
export class DateTimeUtil {
    
    static readonly TIMEZONE_VANCOUVER: string = 'America/Vancouver';
    static readonly DATE_FORMAT = "YYYY-MM-DD";

    /**
     * This return timezone based date/time or server local date/time.
     * @param timezone valid TimeZone string e.g 'America/Vancouver'
     * @returns current date/time based on 'timezone'. If 'timezone' is not provided, server local date/time.
     */
    public static now(inTimezone: string) {
        DateTimeUtil.init();
        if (!inTimezone) {
            return dayjs(); // dayjs is based on local. If server is using UTC date/time, then it is UTC date/time.
        }
        return dayjs.tz(dayjs().utc(), DateTimeUtil.DATE_FORMAT, inTimezone);
    }

    public static nowBC() {
        return DateTimeUtil.now(DateTimeUtil.TIMEZONE_VANCOUVER);
    }

    /**
     * 
     * @param dateInput valid date input string for parsing.
     * @param timezone valid TimeZone string e.g 'America/Vancouver'.
     * @returns dayjs object based on 'timezone'.
     */
    public static get(dateInput: string, inTimezone: string) {
        DateTimeUtil.init();
        dayjs.extend(utc);
        dayjs.extend(timezone);
        if (!inTimezone) {
            return dayjs(dateInput);
        }
        return dayjs(dateInput).tz(inTimezone);
    }

    /**
     * 
     * @param dateInput valid date input string for parsing.
     * @returns dayjs object at BC timezone 'America/Vancouver'.
     */
    public static getBcDate(dateInput: string) {
        return this.get(dateInput, DateTimeUtil.TIMEZONE_VANCOUVER);
    }

    /**
     * 
     * @param startDateSt beginning date as string.
     * @param endDateSt end date as string.
     * @param timezone valid TimeZone string e.g 'America/Vancouver'.
     * @param unit dayjs valid unit.
     * @returns # of unit difference between two dates.
     */
    public static diff(startDateSt: string, endDateSt: string, inTimezone: string, unit: any) {
        DateTimeUtil.init();
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const startDate = this.get(startDateSt, inTimezone);
        const endDate = this.get(endDateSt, inTimezone);
        return endDate.startOf(unit).diff(startDate.startOf(unit), unit);
    }

    public static diffNow(endDateSt: string, inTimezone: string, unit: any) {
        DateTimeUtil.init();
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const now = this.now(inTimezone);
        const endDate = this.get(endDateSt, inTimezone);
        return endDate.startOf(unit).diff(now.startOf(unit), unit);
    }

    private static init() {
        // dayjs requres additional plugin for timezone/utc mode.
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(advancedFormat);
    }
}