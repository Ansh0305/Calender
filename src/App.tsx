import { useState, useCallback } from 'react'
import { CalendarView } from './components/Calendar/CalendarView'
import { CalendarEvent } from './types/calendar.types'
import { generateSampleEvents } from './utils/event.utils'

function App() {
    const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents())

    const handleEventAdd = useCallback((event: CalendarEvent) => {
        setEvents(prev => [...prev, event])
    }, [])

    const handleEventUpdate = useCallback((id: string, updates: Partial<CalendarEvent>) => {
        setEvents(prev => prev.map(event =>
            event.id === id ? { ...event, ...updates } : event
        ))
    }, [])

    const handleEventDelete = useCallback((id: string) => {
        setEvents(prev => prev.filter(event => event.id !== id))
    }, [])

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Calendar View</h1>
                    <p className="text-neutral-500 mt-1">Interactive calendar component with event management</p>
                </header>
                <CalendarView
                    events={events}
                    onEventAdd={handleEventAdd}
                    onEventUpdate={handleEventUpdate}
                    onEventDelete={handleEventDelete}
                />
            </div>
        </div>
    )
}

export default App
