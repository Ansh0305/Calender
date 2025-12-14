import React, { memo, useCallback } from 'react';
import clsx from 'clsx';
import { CalendarEvent } from '@/types/calendar.types';
import { isToday, isCurrentMonth, getDayNumber } from '@/utils/date.utils';
import { getContrastColor } from '@/utils/event.utils';

interface CalendarCellProps {
    date: Date;
    currentDate: Date;
    events: CalendarEvent[];
    isSelected: boolean;
    onClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}

export const CalendarCell = memo<CalendarCellProps>(
    ({ date, currentDate, events, isSelected, onClick, onEventClick }) => {
        const dayNumber = getDayNumber(date);
        const isTodayDate = isToday(date);
        const isInCurrentMonth = isCurrentMonth(date, currentDate);
        const maxVisibleEvents = 3;
        const visibleEvents = events.slice(0, maxVisibleEvents);
        const remainingCount = events.length - maxVisibleEvents;

        const handleCellClick = useCallback(
            (e: React.MouseEvent) => {
                // Only trigger if clicking the cell itself, not an event
                if ((e.target as HTMLElement).closest('[data-event]')) return;
                onClick(date);
            },
            [date, onClick]
        );

        const handleCellKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(date);
                }
            },
            [date, onClick]
        );

        const handleEventClick = useCallback(
            (e: React.MouseEvent, event: CalendarEvent) => {
                e.stopPropagation();
                onEventClick(event);
            },
            [onEventClick]
        );

        const handleEventKeyDown = useCallback(
            (e: React.KeyboardEvent, event: CalendarEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onEventClick(event);
                }
            },
            [onEventClick]
        );

        return (
            <div
                role="button"
                tabIndex={0}
                aria-label={`${date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                })}. ${events.length} events.`}
                aria-pressed={isSelected}
                onClick={handleCellClick}
                onKeyDown={handleCellKeyDown}
                className={clsx(
                    'min-h-[120px] p-2 border border-neutral-200 cursor-pointer',
                    'transition-colors hover:bg-neutral-50',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                    !isInCurrentMonth && 'bg-neutral-50',
                    isSelected && 'bg-primary-50 ring-2 ring-inset ring-primary-500'
                )}
            >
                {/* Day number */}
                <div className="flex justify-between items-start mb-1">
                    <span
                        className={clsx(
                            'text-sm font-medium',
                            !isInCurrentMonth && 'text-neutral-400',
                            isInCurrentMonth && !isTodayDate && 'text-neutral-900'
                        )}
                    >
                        {!isTodayDate && dayNumber}
                    </span>
                    {isTodayDate && (
                        <span className="w-7 h-7 bg-primary-500 rounded-full text-white text-sm font-medium flex items-center justify-center">
                            {dayNumber}
                        </span>
                    )}
                </div>

                {/* Events list */}
                <div className="space-y-1 overflow-hidden">
                    {visibleEvents.map(event => (
                        <div
                            key={event.id}
                            data-event
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleEventClick(e, event)}
                            onKeyDown={(e) => handleEventKeyDown(e, event)}
                            className={clsx(
                                'text-xs px-2 py-1 rounded truncate cursor-pointer',
                                'hover:opacity-80 transition-opacity',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1'
                            )}
                            style={{
                                backgroundColor: event.color || '#3b82f6',
                                color: getContrastColor(event.color || '#3b82f6')
                            }}
                            title={event.title}
                        >
                            {event.title}
                        </div>
                    ))}

                    {/* "More" button */}
                    {remainingCount > 0 && (
                        <button
                            className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-medium"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(date);
                            }}
                        >
                            +{remainingCount} more
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

CalendarCell.displayName = 'CalendarCell';
