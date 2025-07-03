import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { clsx } from 'clsx';

const InputBase = styled.input`
  display: flex;
  height: 2.25rem;
  width: 100%;
  min-width: 0;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-input-background);
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--color-foreground);
  transition: color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: none;

  &::placeholder {
    color: var(--color-muted-foreground);
  }

  &::selection {
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
  }

  &:focus-visible {
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px rgba(var(--color-ring), 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  &[aria-invalid="true"] {
    border-color: var(--color-destructive);
    box-shadow: 0 0 0 3px rgba(var(--color-destructive), 0.2);
  }

  &[type="file"] {
    border: 0;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;
  }

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <InputBase
        type={type}
        className={clsx(className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";