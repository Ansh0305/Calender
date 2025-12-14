import React, { useCallback } from 'react';
import { CalendarViewProps, CalendarEvent, CalendarView as CalendarViewType } from '@/types/calendar.types';
import { useCalendar } from '@/hooks/useCalendar';
import { useEventManager } from '@/hooks/useEventManager';
import { getMonthYear } from '@/utils/date.utils';
import { Button } from '@/components/primitives/Button';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import clsx from 'clsx';

// Icons as components
const ChevronLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

export const CalendarView: React.FC<CalendarViewProps> = ({
    events,
    onEventAdd,
    onEventUpdate,
    onEventDelete,
    initialView = 'month',
    initialDate,
}) => {
    const {
        currentDate,
        view,
        selectedDate,
        goToNextPeriod,
        goToPreviousPeriod,
        goToToday,
        setView,
        selectDate,
    } = useCalendar({ initialDate, initialView });

    const {
        modalOpen,
        editingEvent,
        selectedDate: modalSelectedDate,
        openCreateModal,
        openEditModal,
        closeModal,
    } = useEventManager();

    // Handle date click (open create modal)
    const handleDateClick = useCallback(
        (date: Date) => {
            selectDate(date);
            openCreateModal(date);
        },
        [selectDate, openCreateModal]
    );

    // Handle event click (open edit modal)
    const handleEventClick = useCallback(
        (event: CalendarEvent) => {
            openEditModal(event);
        },
        [openEditModal]
    );

    // Handle save (create or update)
    const handleSave = useCallback(
        (event: CalendarEvent) => {
            if (editingEvent) {
                onEventUpdate(event.id, event);
            } else {
                onEventAdd(event);
            }
        },
        [editingEvent, onEventAdd, onEventUpdate]
    );

    // Handle view toggle
    const handleViewToggle = useCallback(
        (newView: CalendarViewType) => {
            setView(newView);
        },
        [setView]
    );

    return (
        <div className="space-y-4">
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToPreviousPeriod}
                        aria-label={`Go to previous ${view}`}
                    >
                        <ChevronLeftIcon />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToNextPeriod}
                        aria-label={`Go to next ${view}`}
                    >
                        <ChevronRightIcon />
                    </Button>
                    <h2 className="text-xl font-semibold text-neutral-900 ml-2">
                        {getMonthYear(currentDate)}
                    </h2>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={goToToday}>
                        Today
                    </Button>

                    {/* View toggle */}
                    <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
                        <button
                            onClick={() => handleViewToggle('month')}
                            className={clsx(
                                'px-3 py-1.5 text-sm font-medium transition-colors',
                                view === 'month'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                            )}
                            aria-pressed={view === 'month'}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => handleViewToggle('week')}
                            className={clsx(
                                'px-3 py-1.5 text-sm font-medium transition-colors border-l border-neutral-200',
                                view === 'week'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                            )}
                            aria-pressed={view === 'week'}
                        >
                            Week
                        </button>
                    </div>

                    <Button
                        size="sm"
                        onClick={() => openCreateModal(currentDate)}
                        leftIcon={<PlusIcon />}
                    >
                        <span className="hidden sm:inline">Add Event</span>
                    </Button>
                </div>
            </div>

            {/* Calendar View */}
            {view === 'month' ? (
                <MonthView
                    currentDate={currentDate}
                    events={events}
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                />
            ) : (
                <WeekView
                    currentDate={currentDate}
                    events={events}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                />
            )}

            {/* Event Modal */}
            <EventModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSave={handleSave}
                onDelete={onEventDelete}
                event={editingEvent}
                selectedDate={modalSelectedDate}
            />
        </div>
    );
};
