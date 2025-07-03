import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { clsx } from 'clsx';

const StyledTextarea = styled.textarea`
  display: flex;
  min-height: 4rem;
  width: 100%;
  resize: none;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-input-background);
  padding: 0.5rem 0.75rem;
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

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }

  .dark & {
    background-color: rgba(var(--color-input), 0.3);
  }
`;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledTextarea
        className={clsx(className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";