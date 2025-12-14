import React, { useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { CalendarEvent } from '@/types/calendar.types';
import {
    getWeekDays,
    getHoursArray,
    formatHour,
    isToday,
    getDayNumber,
    getShortDayName,
    getTimeSlotPosition,
    getEventHeight,
    isSameDayCheck,
} from '@/utils/date.utils';
import { getEventsForDate, getContrastColor } from '@/utils/event.utils';

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onDateClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
    currentDate,
    events,
    onDateClick,
    onEventClick,
}) => {
    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
    const hours = useMemo(() => getHoursArray(), []);

    const getEventsForDay = useCallback(
        (date: Date) => getEventsForDate(events, date),
        [events]
    );

    // Handle time slot click
    const handleTimeSlotClick = useCallback(
        (date: Date, hour: number) => {
            const clickedDate = new Date(date);
            clickedDate.setHours(hour, 0, 0, 0);
            onDateClick(clickedDate);
        },
        [onDateClick]
    );

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-card">
            {/* Header with day names */}
            <div className="grid grid-cols-8 border-b border-neutral-200 bg-neutral-50">
                {/* Empty corner cell */}
                <div className="w-16 min-w-[64px]" />

                {/* Day headers */}
                {weekDays.map(day => (
                    <div
                        key={day.toISOString()}
                        className={clsx(
                            'px-2 py-3 text-center border-l border-neutral-200',
                            isToday(day) && 'bg-primary-50'
                        )}
                    >
                        <div className="text-xs text-neutral-500 uppercase">
                            {getShortDayName(day)}
                        </div>
                        <div
                            className={clsx(
                                'text-lg font-semibold mt-1',
                                isToday(day)
                                    ? 'w-8 h-8 mx-auto bg-primary-500 text-white rounded-full flex items-center justify-center'
                                    : 'text-neutral-900'
                            )}
                        >
                            {getDayNumber(day)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto max-h-[600px]">
                <div className="grid grid-cols-8">
                    {/* Hour labels column */}
                    <div className="w-16 min-w-[64px]">
                        {hours.map(hour => (
                            <div
                                key={hour}
                                className="h-12 border-b border-neutral-100 pr-2 flex items-start justify-end"
                            >
                                <span className="text-xs text-neutral-500 -mt-2">
                                    {formatHour(hour)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDays.map(day => {
                        const dayEvents = getEventsForDay(day);

                        return (
                            <div
                                key={day.toISOString()}
                                className="relative border-l border-neutral-200"
                            >
                                {/* Hour slots */}
                                {hours.map(hour => (
                                    <div
                                        key={hour}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleTimeSlotClick(day, hour)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleTimeSlotClick(day, hour);
                                            }
                                        }}
                                        className={clsx(
                                            'h-12 border-b border-neutral-100 cursor-pointer',
                                            'hover:bg-neutral-50 transition-colors',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500'
                                        )}
                                        aria-label={`${day.toLocaleDateString()} at ${formatHour(hour)}`}
                                    />
                                ))}

                                {/* Events overlay */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {dayEvents.map(event => {
                                        // Only show events that start on this day
                                        if (!isSameDayCheck(event.startDate, day)) return null;

                                        const topPosition = getTimeSlotPosition(event.startDate);
                                        const height = Math.max(getEventHeight(event.startDate, event.endDate), 2);

                                        return (
                                            <div
                                                key={event.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onEventClick(event);
                                                    }
                                                }}
                                                className={clsx(
                                                    'absolute left-1 right-1 px-1 py-0.5 rounded text-xs overflow-hidden',
                                                    'pointer-events-auto cursor-pointer',
                                                    'hover:opacity-90 transition-opacity',
                                                    'focus-visible:outline-none focus-visible:ring-2'
                                                )}
                                                style={{
                                                    top: `${topPosition}%`,
                                                    height: `${height}%`,
                                                    minHeight: '20px',
                                                    backgroundColor: event.color || '#3b82f6',
                                                    color: getContrastColor(event.color || '#3b82f6'),
                                                }}
                                                title={`${event.title} - ${event.startDate.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}`}
                                            >
                                                <div className="font-medium truncate">{event.title}</div>
                                                <div className="text-[10px] opacity-80 truncate">
                                                    {event.startDate.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
