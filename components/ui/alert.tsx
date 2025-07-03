import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { clsx } from 'clsx';

const StyledAlert = styled.div<{
  variant?: 'default' | 'destructive';
}>`
  position: relative;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  padding: 1rem;
  font-size: 0.875rem;
  display: grid;
  grid-template-columns: 0 1fr;
  gap: 0.5rem 0;
  align-items: start;

  &:has(svg) {
    grid-template-columns: calc(1rem) 1fr;
    gap: 0rem 0.75rem;
  }

  svg {
    width: 1rem;
    height: 1rem;
    transform: translateY(0.125rem);
    color: currentColor;
  }

  ${props => (!props.variant || props.variant === 'default') && css`
    background-color: var(--color-card);
    color: var(--color-card-foreground);
  `}

  ${props => props.variant === 'destructive' && css`
    color: var(--color-destructive);
    background-color: var(--color-card);
    
    [data-slot="alert-description"] {
      color: rgba(var(--color-destructive), 0.9);
    }
  `}
`;

const StyledAlertTitle = styled.div`
  grid-column-start: 2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  min-height: 1rem;
  font-weight: 500;
  letter-spacing: -0.025em;
`;

const StyledAlertDescription = styled.div`
  color: var(--color-muted-foreground);
  grid-column-start: 2;
  display: grid;
  justify-items: start;
  gap: 0.25rem;
  font-size: 0.875rem;

  p {
    line-height: 1.625;
  }
`;

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {}
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <StyledAlert
      ref={ref}
      role="alert"
      variant={variant}
      className={clsx(className)}
      {...props}
    />
  )
);

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <StyledAlertTitle
      ref={ref}
      data-slot="alert-title"
      className={clsx(className)}
      {...props}
    />
  )
);

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <StyledAlertDescription
      ref={ref}
      data-slot="alert-description"
      className={clsx(className)}
      {...props}
    />
  )
);

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";