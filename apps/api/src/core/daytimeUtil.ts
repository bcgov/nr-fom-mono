import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

/**
 * This util acts as a wrapper for some date/time munipulation functions, especially for timezone related transform.
 * Current implemented is based on dayjs library. Could change to use libraries if needed.
 * Use this as centralized date/time calculation so that if there is a bug, it is easier to fix all.
 */
export class DateTimeUtil {
    
    static readonly TIMEZONE_VANCOUVER: string = 'America/Vancouver';
    static readonly DATE_FORMAT = "YYYY-MM-DD";

    constructor() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(advancedFormat);
    }

    /**
     * This return timezone based date/time or server local date/time.
     * @param timezone valid TimeZone string e.g 'America/Vancouver'
     * @returns current date/time based on 'timezone'. If 'timezone' is not provided, server local date/time.
     */
    public now(timezone: string) {
        if (!timezone) {
            return dayjs(); // dayjs is based on local. If server is using UTC date/time, then it is UTC date/time.
        }
        return dayjs.tz(dayjs().utc(), DateTimeUtil.DATE_FORMAT, timezone);
    }

    public get(dateInput: string, timezone: string) {
        if (!timezone) {
            return dayjs(dateInput);
        }
        return dayjs(dateInput).tz(timezone);
    }

    public diff(startDateSt: string, endDateSt: string, timezone: string, unit: any) {
        const startDate = this.get(startDateSt, timezone);
        const endDate = this.get(endDateSt, timezone);
        return endDate.startOf(unit).diff(startDate.startOf(unit), unit);
    }

    public diffNow(endDateSt: string, timezone: string, unit: any) {
        const now = this.now(timezone);
        const endDate = this.get(endDateSt, timezone);
        return endDate.startOf(unit).diff(now.startOf(unit), unit);
    }
}