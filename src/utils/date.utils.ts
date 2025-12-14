import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameDay,
    isSameMonth,
    isToday as isDateToday,
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
    getHours,
    getMinutes,
    differenceInMinutes,
    setHours,
    setMinutes,
    parseISO,
} from 'date-fns';

/**
 * Get the calendar grid for a month view (42 cells - 6 weeks)
 * @param date - Any date in the target month
 * @returns Array of 42 dates representing the calendar grid
 */
export const getCalendarGrid = (date: Date): Date[] => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Ensure we always have exactly 42 cells (6 weeks)
    while (days.length < 42) {
        const lastDay = days[days.length - 1];
        if (lastDay) {
            days.push(new Date(lastDay.getTime() + 24 * 60 * 60 * 1000));
        }
    }

    return days.slice(0, 42);
};

/**
 * Get the 7 days of a week containing the given date
 * @param date - Any date in the target week
 * @returns Array of 7 dates representing the week
 */
export const getWeekDays = (date: Date): Date[] => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

/**
 * Check if two dates are the same day
 */
export const isSameDayCheck = (date1: Date, date2: Date): boolean => {
    return isSameDay(date1, date2);
};

/**
 * Check if a date is in the current month
 */
export const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
    return isSameMonth(date, currentDate);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
    return isDateToday(date);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date, formatString: string = 'MMMM yyyy'): string => {
    return format(date, formatString);
};

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Format time for input fields (HH:mm)
 */
export const formatTimeForInput = (date: Date): string => {
    return format(date, 'HH:mm');
};

/**
 * Get next month's date
 */
export const getNextMonth = (date: Date): Date => {
    return addMonths(date, 1);
};

/**
 * Get previous month's date
 */
export const getPreviousMonth = (date: Date): Date => {
    return subMonths(date, 1);
};

/**
 * Get next week's date
 */
export const getNextWeek = (date: Date): Date => {
    return addWeeks(date, 1);
};

/**
 * Get previous week's date
 */
export const getPreviousWeek = (date: Date): Date => {
    return subWeeks(date, 1);
};

/**
 * Get time slot position as percentage
 * @param date - Date with time to position
 * @returns Top position percentage (0-100)
 */
export const getTimeSlotPosition = (date: Date): number => {
    const hours = getHours(date);
    const minutes = getMinutes(date);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

/**
 * Get event height based on duration
 * @param startDate - Event start date
 * @param endDate - Event end date
 * @returns Height percentage
 */
export const getEventHeight = (startDate: Date, endDate: Date): number => {
    const durationMinutes = differenceInMinutes(endDate, startDate);
    return (durationMinutes / (24 * 60)) * 100;
};

/**
 * Parse date and time strings into a Date object
 */
export const parseDateTimeInputs = (dateString: string, timeString: string): Date => {
    const date = parseISO(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    return setMinutes(setHours(date, hours ?? 0), minutes ?? 0);
};

/**
 * Get hours array for week view (0-23)
 */
export const getHoursArray = (): number[] => {
    return Array.from({ length: 24 }, (_, i) => i);
};

/**
 * Format hour for display (e.g., "9 AM", "2 PM")
 */
export const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
};

/**
 * Get day number from date
 */
export const getDayNumber = (date: Date): number => {
    return date.getDate();
};

/**
 * Get day name (e.g., "Monday")
 */
export const getDayName = (date: Date): string => {
    return format(date, 'EEEE');
};

/**
 * Get short day name (e.g., "Mon")
 */
export const getShortDayName = (date: Date): string => {
    return format(date, 'EEE');
};

/**
 * Get month name and year (e.g., "January 2024")
 */
export const getMonthYear = (date: Date): string => {
    return format(date, 'MMMM yyyy');
};
