import React, { useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Handle escape key
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    // Focus trap
    const handleFocusTrap = useCallback((event: KeyboardEvent) => {
        if (event.key !== 'Tab' || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Store previous focus
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Add event listeners
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keydown', handleFocusTrap);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Focus first focusable element
            const timer = setTimeout(() => {
                const firstInput = modalRef.current?.querySelector<HTMLElement>(
                    'input, select, textarea, button'
                );
                firstInput?.focus();
            }, 0);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keydown', handleFocusTrap);
                document.body.style.overflow = '';

                // Restore previous focus
                previousFocusRef.current?.focus();
            };
        }
    }, [isOpen, handleKeyDown, handleFocusTrap]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby={description ? 'modal-description' : undefined}
                className={clsx(
                    'relative w-full bg-white rounded-xl shadow-modal',
                    'animate-slide-up',
                    sizeStyles[size]
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                    <div>
                        <h2
                            id="modal-title"
                            className="text-lg font-semibold text-neutral-900"
                        >
                            {title}
                        </h2>
                        {description && (
                            <p
                                id="modal-description"
                                className="mt-1 text-sm text-neutral-500"
                            >
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
