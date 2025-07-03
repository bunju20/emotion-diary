import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { clsx } from 'clsx';

const BadgeBase = styled.span<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 0.25rem;
  transition: color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  overflow: hidden;

  &:focus-visible {
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px rgba(var(--color-ring), 0.5);
  }

  &[aria-invalid="true"] {
    border-color: var(--color-destructive);
    box-shadow: 0 0 0 3px rgba(var(--color-destructive), 0.2);
  }

  /* Variant styles */
  ${props => (!props.variant || props.variant === 'default') && css`
    border-color: transparent;
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
    
    &:hover {
      background-color: var(--color-primary);
      opacity: 0.9;
    }
  `}

  ${props => props.variant === 'secondary' && css`
    border-color: transparent;
    background-color: var(--color-secondary);
    color: var(--color-secondary-foreground);
    
    &:hover {
      background-color: var(--color-secondary);
      opacity: 0.9;
    }
  `}

  ${props => props.variant === 'destructive' && css`
    border-color: transparent;
    background-color: var(--color-destructive);
    color: var(--color-destructive-foreground);
    
    &:hover {
      background-color: var(--color-destructive);
      opacity: 0.9;
    }
  `}

  ${props => props.variant === 'outline' && css`
    color: var(--color-foreground);
    
    &:hover {
      background-color: var(--color-accent);
      color: var(--color-accent-foreground);
    }
  `}
`;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <BadgeBase
      ref={ref}
      variant={variant}
      className={clsx(className)}
      {...props}
    />
  )
);

Badge.displayName = "Badge";