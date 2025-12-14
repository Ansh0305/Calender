import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    id?: string;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    error,
    disabled = false,
    id,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (disabled) return;

            switch (event.key) {
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    if (isOpen && focusedIndex >= 0) {
                        const option = options[focusedIndex];
                        if (option) {
                            onChange(option.value);
                            setIsOpen(false);
                        }
                    } else {
                        setIsOpen(!isOpen);
                    }
                    break;
                case 'Escape':
                    setIsOpen(false);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if (!isOpen) {
                        setIsOpen(true);
                    } else {
                        setFocusedIndex(prev =>
                            prev < options.length - 1 ? prev + 1 : 0
                        );
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (!isOpen) {
                        setIsOpen(true);
                    } else {
                        setFocusedIndex(prev =>
                            prev > 0 ? prev - 1 : options.length - 1
                        );
                    }
                    break;
                case 'Home':
                    event.preventDefault();
                    setFocusedIndex(0);
                    break;
                case 'End':
                    event.preventDefault();
                    setFocusedIndex(options.length - 1);
                    break;
            }
        },
        [disabled, isOpen, focusedIndex, options, onChange]
    );

    // Scroll focused item into view
    useEffect(() => {
        if (isOpen && focusedIndex >= 0 && listRef.current) {
            const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
            focusedElement?.scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex, isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-neutral-700 mb-1"
                >
                    {label}
                </label>
            )}
            <button
                id={selectId}
                type="button"
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={`${selectId}-listbox`}
                aria-labelledby={label ? `${selectId}-label` : undefined}
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={clsx(
                    'w-full flex items-center justify-between px-3 py-2 text-left',
                    'bg-white border rounded-lg text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    'transition-colors',
                    disabled
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'hover:bg-neutral-50 cursor-pointer',
                    error
                        ? 'border-error-500'
                        : 'border-neutral-300'
                )}
            >
                <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-500'}>
                    {selectedOption?.label || placeholder}
                </span>
                <svg
                    className={clsx(
                        'w-5 h-5 text-neutral-400 transition-transform',
                        isOpen && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <ul
                    id={`${selectId}-listbox`}
                    ref={listRef}
                    role="listbox"
                    aria-labelledby={selectId}
                    className={clsx(
                        'absolute z-10 w-full mt-1 py-1',
                        'bg-white border border-neutral-200 rounded-lg shadow-card',
                        'max-h-60 overflow-auto',
                        'animate-fade-in'
                    )}
                >
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => handleSelect(option.value)}
                            onMouseEnter={() => setFocusedIndex(index)}
                            className={clsx(
                                'px-3 py-2 text-sm cursor-pointer',
                                'transition-colors',
                                option.value === value
                                    ? 'bg-primary-50 text-primary-700'
                                    : focusedIndex === index
                                        ? 'bg-neutral-100 text-neutral-900'
                                        : 'text-neutral-700 hover:bg-neutral-50'
                            )}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}

            {error && (
                <p className="mt-1 text-sm text-error-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};
