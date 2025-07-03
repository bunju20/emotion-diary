import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { clsx } from 'clsx';

const LabelBase = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
  font-weight: 500;
  user-select: none;

  &:has(:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  &:has([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelBase
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

Label.displayName = "Label";