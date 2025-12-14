import { useState, useCallback } from 'react';
import { CalendarState, CalendarView } from '@/types/calendar.types';
import {
    getNextMonth,
    getPreviousMonth,
    getNextWeek,
    getPreviousWeek
} from '@/utils/date.utils';

interface UseCalendarOptions {
    initialDate?: Date;
    initialView?: CalendarView;
}

interface UseCalendarReturn extends CalendarState {
    goToNextPeriod: () => void;
    goToPreviousPeriod: () => void;
    goToToday: () => void;
    goToDate: (date: Date) => void;
    setView: (view: CalendarView) => void;
    selectDate: (date: Date | null) => void;
}

/**
 * Custom hook for managing calendar navigation state
 */
export const useCalendar = (options: UseCalendarOptions = {}): UseCalendarReturn => {
    const { initialDate = new Date(), initialView = 'month' } = options;

    const [state, setState] = useState<CalendarState>({
        currentDate: initialDate,
        view: initialView,
        selectedDate: null,
    });

    const goToNextPeriod = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentDate: prev.view === 'month'
                ? getNextMonth(prev.currentDate)
                : getNextWeek(prev.currentDate),
        }));
    }, []);

    const goToPreviousPeriod = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentDate: prev.view === 'month'
                ? getPreviousMonth(prev.currentDate)
                : getPreviousWeek(prev.currentDate),
        }));
    }, []);

    const goToToday = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentDate: new Date(),
        }));
    }, []);

    const goToDate = useCallback((date: Date) => {
        setState(prev => ({
            ...prev,
            currentDate: date,
        }));
    }, []);

    const setView = useCallback((view: CalendarView) => {
        setState(prev => ({
            ...prev,
            view,
        }));
    }, []);

    const selectDate = useCallback((date: Date | null) => {
        setState(prev => ({
            ...prev,
            selectedDate: date,
        }));
    }, []);

    return {
        ...state,
        goToNextPeriod,
        goToPreviousPeriod,
        goToToday,
        goToDate,
        setView,
        selectDate,
    };
};
