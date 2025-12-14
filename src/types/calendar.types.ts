/**
 * Represents a calendar event
 */
export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    color?: string;
    category?: string;
}

/**
 * Calendar view type
 */
export type CalendarView = 'month' | 'week';

/**
 * Calendar state for navigation and view control
 */
export interface CalendarState {
    currentDate: Date;
    view: CalendarView;
    selectedDate: Date | null;
}

/**
 * Props for the main CalendarView component
 */
export interface CalendarViewProps {
    events: CalendarEvent[];
    onEventAdd: (event: CalendarEvent) => void;
    onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
    onEventDelete: (id: string) => void;
    initialView?: CalendarView;
    initialDate?: Date;
}

/**
 * Form data for creating/editing events
 */
export interface EventFormData {
    title: string;
    description: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    color: string;
    category: string;
}

/**
 * Form validation errors
 */
export type FormErrors = Partial<Record<keyof EventFormData, string>>;

/**
 * Event category options
 */
export const EVENT_CATEGORIES = [
    'Meeting',
    'Work',
    'Personal',
    'Design',
    'Development',
    'Other',
] as const;

/**
 * Event color presets
 */
export const EVENT_COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Orange', value: '#f97316' },
] as const;

/**
 * Days of the week
 */
export const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const;

/**
 * Short day names for header
 */
export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
