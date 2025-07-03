import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { clsx } from 'clsx';

const SwitchBase = styled.button<{ checked?: boolean }>`
  display: inline-flex;
  height: 1.15rem;
  width: 2rem;
  flex-shrink: 0;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  background-color: ${props => props.checked ? 'var(--color-primary)' : 'var(--color-switch-background)'};
  transition: all 0.15s ease-in-out;
  outline: none;
  cursor: pointer;

  &:focus-visible {
    border-color: var(--color-ring);
    box-shadow: 0 0 0 3px rgba(var(--color-ring), 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .dark & {
    background-color: ${props => props.checked ? 'var(--color-primary)' : 'rgba(var(--color-input), 0.8)'};
  }
`;

const SwitchThumb = styled.div<{ checked?: boolean }>`
  pointer-events: none;
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--color-card);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.15s ease-in-out;
  transform: ${props => props.checked ? 'translateX(calc(100% - 2px))' : 'translateX(0)'};

  .dark & {
    background-color: ${props => props.checked ? 'var(--color-primary-foreground)' : 'var(--color-card-foreground)'};
  }
`;

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, onClick, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onCheckedChange?.(!checked);
      onClick?.(event);
    };

    return (
      <SwitchBase
        ref={ref}
        role="switch"
        aria-checked={checked}
        checked={checked}
        className={clsx(className)}
        onClick={handleClick}
        {...props}
      >
        <SwitchThumb checked={checked} />
      </SwitchBase>
    );
  }
);

Switch.displayName = "Switch";