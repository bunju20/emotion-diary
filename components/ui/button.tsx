import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { clsx } from 'clsx';

const ButtonBase = styled.button<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  border: none;
  cursor: pointer;
  outline: none;
  
  &:focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
  }
  
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Size variants */
  ${props => props.size === 'sm' && css`
    height: 2rem;
    padding: 0 0.75rem;
    border-radius: 0.375rem;
  `}
  
  ${props => props.size === 'lg' && css`
    height: 2.75rem;
    padding: 0 2rem;
    border-radius: 0.375rem;
  `}
  
  ${props => props.size === 'icon' && css`
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border-radius: 0.375rem;
  `}
  
  ${props => (!props.size || props.size === 'default') && css`
    height: 2.25rem;
    padding: 0 1rem;
  `}

  /* Variant styles */
  ${props => (!props.variant || props.variant === 'default') && css`
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
    
    &:hover {
      background-color: var(--color-primary);
      opacity: 0.9;
    }
  `}
  
  ${props => props.variant === 'destructive' && css`
    background-color: var(--color-destructive);
    color: var(--color-destructive-foreground);
    
    &:hover {
      background-color: var(--color-destructive);
      opacity: 0.9;
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-foreground);
    
    &:hover {
      background-color: var(--color-accent);
      color: var(--color-accent-foreground);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: var(--color-secondary);
    color: var(--color-secondary-foreground);
    
    &:hover {
      background-color: var(--color-secondary);
      opacity: 0.8;
    }
  `}
  
  ${props => props.variant === 'ghost' && css`
    background-color: transparent;
    color: var(--color-foreground);
    
    &:hover {
      background-color: var(--color-accent);
      color: var(--color-accent-foreground);
    }
  `}
  
  ${props => props.variant === 'link' && css`
    background-color: transparent;
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  `}
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <ButtonBase
        className={clsx(className)}
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";