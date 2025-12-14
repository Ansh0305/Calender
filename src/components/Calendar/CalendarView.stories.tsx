import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from '@/types/calendar.types';
import { generateSampleEvents } from '@/utils/event.utils';

const meta: Meta<typeof CalendarView> = {
    title: 'Components/CalendarView',
    component: CalendarView,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A fully interactive calendar component with month and week views, event management, and full accessibility support.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        initialView: {
            control: 'radio',
            options: ['month', 'week'],
            description: 'Initial view mode',
        },
        initialDate: {
            control: 'date',
            description: 'Initial date to display',
        },
    },
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

// Wrapper component for interactive stories
const InteractiveCalendar = ({
    initialEvents = [],
    ...props
}: {
    initialEvents?: CalendarEvent[];
} & Partial<React.ComponentProps<typeof CalendarView>>) => {
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

    const handleEventAdd = useCallback((event: CalendarEvent) => {
        setEvents(prev => [...prev, event]);
    }, []);

    const handleEventUpdate = useCallback((id: string, updates: Partial<CalendarEvent>) => {
        setEvents(prev => prev.map(event =>
            event.id === id ? { ...event, ...updates } : event
        ));
    }, []);

    const handleEventDelete = useCallback((id: string) => {
        setEvents(prev => prev.filter(event => event.id !== id));
    }, []);

    return (
        <CalendarView
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            {...props}
        />
    );
};

/**
 * Default calendar view with sample events
 */
export const Default: Story = {
    render: () => <InteractiveCalendar initialEvents={generateSampleEvents()} />,
    parameters: {
        docs: {
            description: {
                story: 'Current month view with sample events. Click on any day to add an event, or click an existing event to edit it.',
            },
        },
    },
};

/**
 * Empty calendar with no events
 */
export const EmptyState: Story = {
    render: () => <InteractiveCalendar initialEvents={[]} />,
    parameters: {
        docs: {
            description: {
                story: 'Calendar with no events. Click on any day to create your first event.',
            },
        },
    },
};

/**
 * Week view demonstration
 */
export const WeekView: Story = {
    render: () => (
        <InteractiveCalendar
            initialEvents={generateSampleEvents()}
            initialView="week"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: 'Week view showing 7-day layout with time slots from 00:00 to 23:00.',
            },
        },
    },
};

// Generate many events for stress testing
const generateManyEvents = (): CalendarEvent[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const events: CalendarEvent[] = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4', '#f97316'];
    const titles = [
        'Team Standup', 'Design Review', 'Client Call', 'Sprint Planning',
        'Code Review', 'Product Demo', 'Lunch Meeting', 'Training Session',
        'Interview', 'Workshop', 'Presentation', 'Brainstorm'
    ];

    for (let i = 0; i < 25; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const hour = Math.floor(Math.random() * 10) + 8;
        const duration = Math.floor(Math.random() * 3) + 1;

        events.push({
            id: `evt-${i}`,
            title: titles[i % titles.length] ?? 'Event',
            description: `Event ${i + 1} description`,
            startDate: new Date(year, month, day, hour, 0),
            endDate: new Date(year, month, day, hour + duration, 0),
            color: colors[i % colors.length],
            category: 'Meeting',
        });
    }

    return events;
};

/**
 * Calendar with many events (20+)
 */
export const LargeDataset: Story = {
    render: () => <InteractiveCalendar initialEvents={generateManyEvents()} />,
    parameters: {
        docs: {
            description: {
                story: 'Calendar with 20+ events demonstrating performance with a large dataset. Days with more than 3 events show a "+N more" link.',
            },
        },
    },
};

/**
 * Interactive demo with full functionality
 */
export const InteractiveDemo: Story = {
    render: () => <InteractiveCalendar initialEvents={generateSampleEvents()} />,
    parameters: {
        docs: {
            description: {
                story: 'Fully interactive calendar. Try: clicking a day to add events, clicking events to edit, using navigation controls, and switching between month/week views.',
            },
        },
    },
};

/**
 * Mobile view demonstration
 */
export const MobileView: Story = {
    render: () => <InteractiveCalendar initialEvents={generateSampleEvents()} />,
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Calendar component displayed at mobile viewport width. The layout adapts with smaller text and simplified day headers.',
            },
        },
    },
};

/**
 * Accessibility demonstration
 */
export const AccessibilityDemo: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-2">Keyboard Navigation Guide</h3>
                <ul className="text-sm text-primary-800 space-y-1">
                    <li><kbd className="px-1 py-0.5 bg-white rounded border">Tab</kbd> - Move between interactive elements</li>
                    <li><kbd className="px-1 py-0.5 bg-white rounded border">Enter</kbd> / <kbd className="px-1 py-0.5 bg-white rounded border">Space</kbd> - Activate focused element</li>
                    <li><kbd className="px-1 py-0.5 bg-white rounded border">Escape</kbd> - Close modal dialogs</li>
                    <li><kbd className="px-1 py-0.5 bg-white rounded border">Arrow Keys</kbd> - Navigate within dropdowns</li>
                </ul>
            </div>
            <InteractiveCalendar initialEvents={generateSampleEvents()} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates keyboard accessibility. All interactive elements are focusable and operable via keyboard.',
            },
        },
    },
};
