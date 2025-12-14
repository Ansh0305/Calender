import { CalendarEvent, EventFormData, FormErrors, EVENT_COLORS } from '@/types/calendar.types';
import { isSameDayCheck, parseDateTimeInputs, formatDateForInput, formatTimeForInput } from './date.utils';
import { isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

/**
 * Generate a unique ID for events
 */
export const generateEventId = (): string => {
    return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Filter events for a specific date
 */
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
    return events.filter(event => {
        // Check if the event occurs on this date
        const eventStart = startOfDay(event.startDate);
        const eventEnd = endOfDay(event.endDate);
        const checkDate = startOfDay(date);

        return isWithinInterval(checkDate, { start: eventStart, end: eventEnd }) ||
            isSameDay(event.startDate, date) ||
            isSameDay(event.endDate, date);
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

/**
 * Filter events for a specific week
 */
export const getEventsForWeek = (events: CalendarEvent[], weekDays: Date[]): CalendarEvent[] => {
    const weekStart = weekDays[0];
    const weekEnd = weekDays[weekDays.length - 1];

    if (!weekStart || !weekEnd) return [];

    return events.filter(event => {
        return isWithinInterval(event.startDate, {
            start: startOfDay(weekStart),
            end: endOfDay(weekEnd)
        }) || isWithinInterval(event.endDate, {
            start: startOfDay(weekStart),
            end: endOfDay(weekEnd)
        });
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

/**
 * Validate event form data
 */
export const validateEventForm = (data: EventFormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.title.trim()) {
        errors.title = 'Title is required';
    } else if (data.title.length > 100) {
        errors.title = 'Title must be 100 characters or less';
    }

    if (data.description && data.description.length > 500) {
        errors.description = 'Description must be 500 characters or less';
    }

    if (!data.startDate) {
        errors.startDate = 'Start date is required';
    }

    if (!data.startTime) {
        errors.startTime = 'Start time is required';
    }

    if (!data.endDate) {
        errors.endDate = 'End date is required';
    }

    if (!data.endTime) {
        errors.endTime = 'End time is required';
    }

    // Validate end is after start
    if (data.startDate && data.startTime && data.endDate && data.endTime) {
        const start = parseDateTimeInputs(data.startDate, data.startTime);
        const end = parseDateTimeInputs(data.endDate, data.endTime);

        if (end <= start) {
            errors.endDate = 'End must be after start';
        }
    }

    return errors;
};

/**
 * Convert form data to CalendarEvent
 */
export const formDataToEvent = (data: EventFormData, existingId?: string): CalendarEvent => {
    return {
        id: existingId ?? generateEventId(),
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        startDate: parseDateTimeInputs(data.startDate, data.startTime),
        endDate: parseDateTimeInputs(data.endDate, data.endTime),
        color: data.color || EVENT_COLORS[0]?.value,
        category: data.category || undefined,
    };
};

/**
 * Convert CalendarEvent to form data
 */
export const eventToFormData = (event: CalendarEvent): EventFormData => {
    return {
        title: event.title,
        description: event.description ?? '',
        startDate: formatDateForInput(event.startDate),
        startTime: formatTimeForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        endTime: formatTimeForInput(event.endDate),
        color: event.color ?? EVENT_COLORS[0]?.value ?? '#3b82f6',
        category: event.category ?? '',
    };
};

/**
 * Get default form data for a new event
 */
export const getDefaultFormData = (date?: Date): EventFormData => {
    const now = date ?? new Date();
    const startDate = formatDateForInput(now);

    // Default to next hour
    const startHour = now.getHours() + 1;
    const startTime = `${String(startHour).padStart(2, '0')}:00`;
    const endTime = `${String(startHour + 1).padStart(2, '0')}:00`;

    return {
        title: '',
        description: '',
        startDate,
        startTime,
        endDate: startDate,
        endTime,
        color: EVENT_COLORS[0]?.value ?? '#3b82f6',
        category: '',
    };
};

/**
 * Generate sample events for demonstration
 */
export const generateSampleEvents = (): CalendarEvent[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    return [
        {
            id: 'evt-1',
            title: 'Team Standup',
            description: 'Daily sync with the team',
            startDate: new Date(year, month, today.getDate(), 9, 0),
            endDate: new Date(year, month, today.getDate(), 9, 30),
            color: '#3b82f6',
            category: 'Meeting',
        },
        {
            id: 'evt-2',
            title: 'Design Review',
            description: 'Review new component designs',
            startDate: new Date(year, month, today.getDate(), 14, 0),
            endDate: new Date(year, month, today.getDate(), 15, 30),
            color: '#10b981',
            category: 'Design',
        },
        {
            id: 'evt-3',
            title: 'Client Presentation',
            description: 'Present Q4 roadmap to stakeholders',
            startDate: new Date(year, month, today.getDate() + 1, 10, 0),
            endDate: new Date(year, month, today.getDate() + 1, 11, 30),
            color: '#f59e0b',
            category: 'Meeting',
        },
        {
            id: 'evt-4',
            title: 'Development Sprint',
            description: 'Sprint planning and task assignment',
            startDate: new Date(year, month, today.getDate() + 2, 9, 0),
            endDate: new Date(year, month, today.getDate() + 2, 17, 0),
            color: '#8b5cf6',
            category: 'Work',
        },
        {
            id: 'evt-5',
            title: 'Lunch with Team',
            startDate: new Date(year, month, today.getDate(), 12, 0),
            endDate: new Date(year, month, today.getDate(), 13, 0),
            color: '#ec4899',
            category: 'Personal',
        },
        {
            id: 'evt-6',
            title: 'Code Review',
            description: 'Review pull requests',
            startDate: new Date(year, month, today.getDate() + 3, 15, 0),
            endDate: new Date(year, month, today.getDate() + 3, 16, 0),
            color: '#06b6d4',
            category: 'Development',
        },
        {
            id: 'evt-7',
            title: 'Weekly Planning',
            startDate: new Date(year, month, today.getDate() - 1, 9, 0),
            endDate: new Date(year, month, today.getDate() - 1, 10, 0),
            color: '#3b82f6',
            category: 'Meeting',
        },
        {
            id: 'evt-8',
            title: 'Product Demo',
            description: 'Showcase new features to product team',
            startDate: new Date(year, month, today.getDate() + 4, 14, 0),
            endDate: new Date(year, month, today.getDate() + 4, 15, 0),
            color: '#f97316',
            category: 'Meeting',
        },
    ];
};

/**
 * Get contrasting text color for a background
 */
export const getContrastColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#18181b' : '#ffffff';
};
