# Calendar View Component

A production-grade, accessible, and performant Calendar View component built from scratch using React, TypeScript, and Tailwind CSS.

## 🚀 Live Storybook

[Deployed Storybook URL - Add after deployment]

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd calendar-component

# Install dependencies
npm install

# Run development server
npm run dev

# Run Storybook
npm run storybook
```

## 🏗️ Architecture

The component follows a modular architecture with clear separation of concerns:

```
src/
├── components/
│   ├── Calendar/        # Main calendar components
│   │   ├── CalendarView.tsx       # Main orchestrator
│   │   ├── MonthView.tsx          # 42-cell grid
│   │   ├── WeekView.tsx           # Time slots
│   │   ├── CalendarCell.tsx       # Individual day cell
│   │   └── EventModal.tsx         # Create/Edit form
│   └── primitives/      # Reusable UI elements
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Select.tsx
├── hooks/               # Custom React hooks
│   ├── useCalendar.ts   # Navigation state
│   └── useEventManager.ts
├── utils/               # Utility functions
│   ├── date.utils.ts    # Date manipulation
│   └── event.utils.ts   # Event operations
└── types/               # TypeScript definitions
    └── calendar.types.ts
```

## ✨ Features

- [x] **Month View** - 42-cell grid with event badges
- [x] **Week View** - Time slots (00:00 - 23:00)
- [x] **Event Management** - Create, edit, delete events
- [x] **Form Validation** - Title required, end after start
- [x] **Navigation** - Previous/Next, Today button
- [x] **View Toggle** - Switch between Month/Week
- [x] **Responsive Design** - Mobile, tablet, desktop
- [x] **Keyboard Accessibility** - Full keyboard navigation
- [x] **ARIA Support** - Screen reader friendly
- [x] **Performance Optimized** - Memoization, efficient re-renders

## 📖 Storybook Stories

| Story | Description |
|-------|-------------|
| Default | Current month with sample events |
| EmptyState | Calendar with no events |
| WeekView | Week view with time slots |
| LargeDataset | Calendar with 20+ events |
| InteractiveDemo | Full CRUD functionality |
| MobileView | Responsive mobile layout |
| AccessibilityDemo | Keyboard navigation guide |

## 🛠️ Technologies

- **React 18** - Component framework
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3** - Utility-first styling
- **Vite** - Build tooling
- **Storybook 8** - Component documentation
- **date-fns** - Date manipulation
- **clsx** - Conditional class management

## ♿ Accessibility

- All interactive elements are keyboard accessible
- ARIA labels on calendar cells, events, and modals
- Focus trap in modal dialogs
- Visible focus indicators
- Screen reader announcements

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Move between elements |
| Enter/Space | Activate element |
| Escape | Close modal |
| Arrow Keys | Navigate dropdowns |

## ⚡ Performance

- `React.memo()` for expensive components
- `useCallback` and `useMemo` for stable references
- Efficient event filtering per date
- Minimal re-renders with proper state management

## 📝 Usage

```tsx
import { CalendarView } from './components/Calendar/CalendarView';
import { CalendarEvent } from './types/calendar.types';

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  return (
    <CalendarView
      events={events}
      onEventAdd={(event) => setEvents(prev => [...prev, event])}
      onEventUpdate={(id, updates) => 
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
      }
      onEventDelete={(id) => setEvents(prev => prev.filter(e => e.id !== id))}
      initialView="month"
    />
  );
}
```

## 📧 Contact

saiansh2016@gmail.com

---

Built with ❤️ for the Design System Component Library Frontend Developer Assignment
