import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { clsx } from 'clsx';

const ProgressBase = styled.div`
  position: relative;
  height: 0.5rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background-color: rgba(var(--color-primary), 0.2);
`;

const ProgressIndicator = styled.div<{ value: number }>`
  height: 100%;
  width: 100%;
  flex: 1 1 0%;
  background-color: var(--color-primary);
  transition: all 0.15s ease-in-out;
  transform: translateX(-${props => 100 - (props.value || 0)}%);
`;

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <ProgressBase
      ref={ref}
      className={clsx(className)}
      {...props}
    >
      <ProgressIndicator value={value} />
    </ProgressBase>
  )
);

Progress.displayName = "Progress";