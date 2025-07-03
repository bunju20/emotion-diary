import React, { forwardRef, useState, useRef, useEffect, createContext, useContext } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { clsx } from 'clsx';

const StyledSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelectTrigger = styled.button<{
  size?: 'sm' | 'default';
  isOpen?: boolean;
}>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-input-background);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  white-space: nowrap;
  transition: color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: none;
  cursor: pointer;
  color: var(--color-foreground);

  &[data-placeholder] {
    color: var(--color-muted-foreground);
  }

  &:focus-visible {
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px rgba(var(--color-ring), 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[aria-invalid="true"] {
    border-color: var(--color-destructive);
    box-shadow: 0 0 0 3px rgba(var(--color-destructive), 0.2);
  }

  ${props => props.size === 'sm' && css`
    height: 2rem;
  `}

  ${props => (!props.size || props.size === 'default') && css`
    height: 2.25rem;
  `}

  .dark & {
    background-color: rgba(var(--color-input), 0.3);
    
    &:hover {
      background-color: rgba(var(--color-input), 0.5);
    }
  }
`;

const StyledSelectIcon = styled.span`
  font-size: 1rem;
  opacity: 0.5;
  pointer-events: none;
  flex-shrink: 0;
`;

const StyledSelectContent = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  z-index: 50;
  max-height: 200px;
  min-width: 8rem;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-popover);
  color: var(--color-popover-foreground);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.25rem;
  top: 100%;
  margin-top: 0.25rem;
  
  ${props => !props.isOpen && css`
    display: none;
  `}
`;

const StyledSelectItem = styled.div<{ selected?: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  cursor: default;
  user-select: none;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.125rem;
  padding: 0.375rem 2rem 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;

  &:hover {
    background-color: var(--color-accent);
    color: var(--color-accent-foreground);
  }

  &:focus {
    background-color: var(--color-accent);
    color: var(--color-accent-foreground);
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  ${props => props.selected && css`
    background-color: var(--color-accent);
    color: var(--color-accent-foreground);
  `}
`;

const StyledSelectItemIndicator = styled.span`
  position: absolute;
  right: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default';
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export function Select({ value, onValueChange, children, disabled }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <StyledSelectContainer>
        {children}
      </StyledSelectContainer>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = useContext(SelectContext);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen, setIsOpen]);

    return (
      <div ref={containerRef}>
        <StyledSelectTrigger
          ref={ref}
          size={size}
          isOpen={isOpen}
          className={clsx(className)}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          {children}
          <StyledSelectIcon>▼</StyledSelectIcon>
        </StyledSelectTrigger>
      </div>
    );
  }
);

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => {
    const { value } = useContext(SelectContext);
    
    return (
      <span
        ref={ref}
        className={clsx(className)}
        data-placeholder={!value ? 'true' : undefined}
        {...props}
      >
        {value || placeholder}
      </span>
    );
  }
);

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useContext(SelectContext);
    
    return (
      <StyledSelectContent
        ref={ref}
        isOpen={isOpen}
        className={clsx(className)}
        {...props}
      >
        {children}
      </StyledSelectContent>
    );
  }
);

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const { value, onValueChange, setIsOpen } = useContext(SelectContext);
    const isSelected = value === itemValue;

    const handleClick = () => {
      onValueChange?.(itemValue);
      setIsOpen(false);
    };

    return (
      <StyledSelectItem
        ref={ref}
        selected={isSelected}
        className={clsx(className)}
        onClick={handleClick}
        {...props}
      >
        <StyledSelectItemIndicator>
          {isSelected && <span>✓</span>}
        </StyledSelectItemIndicator>
        {children}
      </StyledSelectItem>
    );
  }
);

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";