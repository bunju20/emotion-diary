import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { clsx } from 'clsx';

const CardBase = styled.div`
  background-color: var(--color-card);
  color: var(--color-card-foreground);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const CardHeaderBase = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  align-items: start;
  gap: 0.375rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  
  &:has([data-slot="card-action"]) {
    grid-template-columns: 1fr auto;
  }
`;

const CardTitleBase = styled.h4`
  line-height: 1;
  font-weight: 500;
`;

const CardDescriptionBase = styled.p`
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
`;

const CardActionBase = styled.div`
  grid-column: 2;
  grid-row: span 2 / span 2;
  grid-row-start: 1;
  align-self: start;
  justify-self: end;
`;

const CardContentBase = styled.div`
  padding: 0 1.5rem;
  
  &:last-child {
    padding-bottom: 1.5rem;
  }
`;

const CardFooterBase = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
`;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <CardBase
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardHeaderBase
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <CardTitleBase
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <CardDescriptionBase
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const CardAction = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardActionBase
      ref={ref}
      data-slot="card-action"
      className={clsx(className)}
      {...props}
    />
  )
);

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardContentBase
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardFooterBase
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardAction.displayName = "CardAction";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";