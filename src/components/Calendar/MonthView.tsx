import React, { useMemo, useCallback } from 'react';
import { CalendarEvent, DAYS_SHORT } from '@/types/calendar.types';
import { getCalendarGrid, isSameDayCheck } from '@/utils/date.utils';
import { getEventsForDate } from '@/utils/event.utils';
import { CalendarCell } from './CalendarCell';

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    selectedDate: Date | null;
    onDateClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
    currentDate,
    events,
    selectedDate,
    onDateClick,
    onEventClick,
}) => {
    // Get calendar grid (42 cells)
    const calendarDays = useMemo(
        () => getCalendarGrid(currentDate),
        [currentDate]
    );

    // Get events for each day
    const getEventsForDay = useCallback(
        (date: Date) => getEventsForDate(events, date),
        [events]
    );

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-card">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-neutral-50 border-b border-neutral-200">
                {DAYS_SHORT.map(day => (
                    <div
                        key={day}
                        className="px-2 py-3 text-center text-sm font-semibold text-neutral-600"
                        role="columnheader"
                    >
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.charAt(0)}</span>
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div
                className="grid grid-cols-7"
                role="grid"
                aria-label="Calendar"
            >
                {calendarDays.map((date, index) => (
                    <CalendarCell
                        key={`${date.toISOString()}-${index}`}
                        date={date}
                        currentDate={currentDate}
                        events={getEventsForDay(date)}
                        isSelected={selectedDate ? isSameDayCheck(date, selectedDate) : false}
                        onClick={onDateClick}
                        onEventClick={onEventClick}
                    />
                ))}
            </div>
        </div>
    );
};
