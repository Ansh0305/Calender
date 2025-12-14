import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar.types';

interface UseEventManagerReturn {
    modalOpen: boolean;
    editingEvent: CalendarEvent | null;
    selectedDate: Date | null;
    openCreateModal: (date: Date) => void;
    openEditModal: (event: CalendarEvent) => void;
    closeModal: () => void;
}

/**
 * Custom hook for managing event modal state
 */
export const useEventManager = (): UseEventManagerReturn => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const openCreateModal = useCallback((date: Date) => {
        setEditingEvent(null);
        setSelectedDate(date);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((event: CalendarEvent) => {
        setEditingEvent(event);
        setSelectedDate(null);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditingEvent(null);
        setSelectedDate(null);
    }, []);

    return {
        modalOpen,
        editingEvent,
        selectedDate,
        openCreateModal,
        openEditModal,
        closeModal,
    };
};
