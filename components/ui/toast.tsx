import React, { useState, useEffect, createContext, useContext } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { clsx } from 'clsx';

const slideInFromTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutToTop = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const StyledToastContainer = styled.div<{ position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right' }>`
  position: fixed;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
  max-width: 420px;
  width: 100%;
  padding: 1rem;

  ${props => {
    switch (props.position) {
      case 'top-right':
        return `
          top: 0;
          right: 0;
        `;
      case 'bottom-center':
        return `
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom-right':
        return `
          bottom: 0;
          right: 0;
        `;
      case 'top-center':
      default:
        return `
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}
`;

const StyledToast = styled.div<{ 
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  isExiting?: boolean;
}>`
  position: relative;
  pointer-events: auto;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  padding: 1rem;
  color: var(--color-foreground);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: ${props => props.isExiting ? slideOutToTop : slideInFromTop} 0.3s ease-in-out;

  ${props => props.variant === 'success' && `
    border-color: #10b981;
    background-color: #ecfdf5;
    color: #065f46;
  `}

  ${props => props.variant === 'error' && `
    border-color: var(--color-destructive);
    background-color: #fef2f2;
    color: #991b1b;
  `}

  ${props => props.variant === 'warning' && `
    border-color: #f59e0b;
    background-color: #fffbeb;
    color: #92400e;
  `}

  ${props => props.variant === 'info' && `
    border-color: #3b82f6;
    background-color: #eff6ff;
    color: #1e40af;
  `}
`;

const StyledToastClose = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  font-size: 0.875rem;
  
  &:hover {
    opacity: 1;
  }
`;

const StyledToastIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const StyledToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledToastTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25;
`;

const StyledToastDescription = styled.div`
  font-size: 0.875rem;
  line-height: 1.25;
  opacity: 0.9;
  margin-top: 0.25rem;
`;

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToasterProps {
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

export function Toaster({ position = 'top-center' }: ToasterProps) {
  const { toasts, removeToast } = useToast();

  return (
    <StyledToastContainer position={position}>
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </StyledToastContainer>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const getIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  return (
    <StyledToast variant={toast.variant} isExiting={isExiting}>
      <StyledToastIcon>{getIcon(toast.variant)}</StyledToastIcon>
      <StyledToastContent>
        {toast.title && <StyledToastTitle>{toast.title}</StyledToastTitle>}
        {toast.description && <StyledToastDescription>{toast.description}</StyledToastDescription>}
      </StyledToastContent>
      <StyledToastClose onClick={handleClose}>✕</StyledToastClose>
    </StyledToast>
  );
}

// Convenience function to use outside of components
export function createToast() {
  return {
    success: (message: string, options?: Partial<Toast>) => ({
      description: message,
      variant: 'success' as const,
      ...options
    }),
    error: (message: string, options?: Partial<Toast>) => ({
      description: message,
      variant: 'error' as const,
      ...options
    }),
    warning: (message: string, options?: Partial<Toast>) => ({
      description: message,
      variant: 'warning' as const,
      ...options
    }),
    info: (message: string, options?: Partial<Toast>) => ({
      description: message,
      variant: 'info' as const,
      ...options
    }),
    default: (message: string, options?: Partial<Toast>) => ({
      description: message,
      variant: 'default' as const,
      ...options
    }),
  };
}