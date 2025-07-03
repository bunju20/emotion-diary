import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { clsx } from 'clsx';

const SeparatorBase = styled.div<{
  orientation?: 'horizontal' | 'vertical';
}>`
  background-color: var(--color-border);
  flex-shrink: 0;

  ${props => props.orientation === 'vertical' ? css`
    height: 100%;
    width: 1px;
  ` : css`
    height: 1px;
    width: 100%;
  `}
`;

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorBase
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      orientation={orientation}
      className={clsx(className)}
      {...props}
    />
  )
);

Separator.displayName = "Separator";