import React, { useState, useCallback, useEffect } from 'react';
import { CalendarEvent, EventFormData, FormErrors, EVENT_COLORS, EVENT_CATEGORIES } from '@/types/calendar.types';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';
import { Select } from '@/components/primitives/Select';
import { validateEventForm, formDataToEvent, eventToFormData, getDefaultFormData } from '@/utils/event.utils';
import clsx from 'clsx';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete?: (id: string) => void;
    event?: CalendarEvent | null;
    selectedDate?: Date | null;
}

export const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    event,
    selectedDate,
}) => {
    const isEditing = !!event;
    const [formData, setFormData] = useState<EventFormData>(getDefaultFormData());
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data
    useEffect(() => {
        if (event) {
            setFormData(eventToFormData(event));
        } else if (selectedDate) {
            setFormData(getDefaultFormData(selectedDate));
        } else {
            setFormData(getDefaultFormData());
        }
        setErrors({});
    }, [event, selectedDate, isOpen]);

    const handleInputChange = useCallback(
        (field: keyof EventFormData) => (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
            // Clear error when user types
            if (errors[field]) {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
        },
        [errors]
    );

    const handleSelectChange = useCallback(
        (field: keyof EventFormData) => (value: string) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        },
        []
    );

    const handleColorSelect = useCallback((color: string) => {
        setFormData(prev => ({ ...prev, color }));
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            const validationErrors = validateEventForm(formData);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            setIsSubmitting(true);

            try {
                const calendarEvent = formDataToEvent(formData, event?.id);
                onSave(calendarEvent);
                onClose();
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, event, onSave, onClose]
    );

    const handleDelete = useCallback(() => {
        if (event && onDelete) {
            onDelete(event.id);
            onClose();
        }
    }, [event, onDelete, onClose]);

    const categoryOptions = EVENT_CATEGORIES.map(cat => ({
        value: cat,
        label: cat,
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Event' : 'Create Event'}
            description={isEditing ? 'Update event details' : 'Add a new event to your calendar'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label
                        htmlFor="event-title"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        Title <span className="text-error-500">*</span>
                    </label>
                    <input
                        id="event-title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange('title')}
                        maxLength={100}
                        placeholder="Event title"
                        className={clsx(
                            'w-full px-3 py-2 border rounded-lg text-sm',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                            errors.title ? 'border-error-500' : 'border-neutral-300'
                        )}
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? 'title-error' : undefined}
                    />
                    {errors.title && (
                        <p id="title-error" className="mt-1 text-sm text-error-500" role="alert">
                            {errors.title}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-neutral-400">
                        {formData.title.length}/100 characters
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="event-description"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="event-description"
                        value={formData.description}
                        onChange={handleInputChange('description')}
                        maxLength={500}
                        rows={3}
                        placeholder="Event description (optional)"
                        className={clsx(
                            'w-full px-3 py-2 border rounded-lg text-sm resize-none',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                            errors.description ? 'border-error-500' : 'border-neutral-300'
                        )}
                    />
                    <p className="mt-1 text-xs text-neutral-400">
                        {formData.description.length}/500 characters
                    </p>
                </div>

                {/* Start Date/Time */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="event-start-date"
                            className="block text-sm font-medium text-neutral-700 mb-1"
                        >
                            Start Date <span className="text-error-500">*</span>
                        </label>
                        <input
                            id="event-start-date"
                            type="date"
                            value={formData.startDate}
                            onChange={handleInputChange('startDate')}
                            className={clsx(
                                'w-full px-3 py-2 border rounded-lg text-sm',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                                errors.startDate ? 'border-error-500' : 'border-neutral-300'
                            )}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="event-start-time"
                            className="block text-sm font-medium text-neutral-700 mb-1"
                        >
                            Start Time <span className="text-error-500">*</span>
                        </label>
                        <input
                            id="event-start-time"
                            type="time"
                            value={formData.startTime}
                            onChange={handleInputChange('startTime')}
                            className={clsx(
                                'w-full px-3 py-2 border rounded-lg text-sm',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                                errors.startTime ? 'border-error-500' : 'border-neutral-300'
                            )}
                        />
                    </div>
                </div>

                {/* End Date/Time */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="event-end-date"
                            className="block text-sm font-medium text-neutral-700 mb-1"
                        >
                            End Date <span className="text-error-500">*</span>
                        </label>
                        <input
                            id="event-end-date"
                            type="date"
                            value={formData.endDate}
                            onChange={handleInputChange('endDate')}
                            className={clsx(
                                'w-full px-3 py-2 border rounded-lg text-sm',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                                errors.endDate ? 'border-error-500' : 'border-neutral-300'
                            )}
                        />
                        {errors.endDate && (
                            <p className="mt-1 text-sm text-error-500" role="alert">
                                {errors.endDate}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="event-end-time"
                            className="block text-sm font-medium text-neutral-700 mb-1"
                        >
                            End Time <span className="text-error-500">*</span>
                        </label>
                        <input
                            id="event-end-time"
                            type="time"
                            value={formData.endTime}
                            onChange={handleInputChange('endTime')}
                            className={clsx(
                                'w-full px-3 py-2 border rounded-lg text-sm',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                                errors.endTime ? 'border-error-500' : 'border-neutral-300'
                            )}
                        />
                    </div>
                </div>

                {/* Color Picker */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Event color">
                        {EVENT_COLORS.map(color => (
                            <button
                                key={color.value}
                                type="button"
                                role="radio"
                                aria-checked={formData.color === color.value}
                                aria-label={color.name}
                                onClick={() => handleColorSelect(color.value)}
                                className={clsx(
                                    'w-8 h-8 rounded-full transition-transform',
                                    'hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                    formData.color === color.value && 'ring-2 ring-offset-2 ring-neutral-900'
                                )}
                                style={{ backgroundColor: color.value }}
                            />
                        ))}
                    </div>
                </div>

                {/* Category */}
                <Select
                    label="Category"
                    options={[{ value: '', label: 'No category' }, ...categoryOptions]}
                    value={formData.category}
                    onChange={handleSelectChange('category')}
                    placeholder="Select a category"
                />

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    {isEditing && onDelete ? (
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    ) : (
                        <div />
                    )}
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            {isEditing ? 'Save Changes' : 'Create Event'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
