import { forwardRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { clsx } from 'clsx';

const SliderBase = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  touch-action: none;
  align-items: center;
  user-select: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

const SliderTrack = styled.div`
  position: relative;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 9999px;
  background-color: var(--color-muted);
  height: 1rem;
`;

const SliderRange = styled.div<{ percentage: number }>`
  position: absolute;
  background-color: var(--color-primary);
  height: 100%;
  width: ${props => props.percentage}%;
`;

const SliderThumb = styled.div<{ position: number }>`
  position: absolute;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  display: block;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  background-color: var(--color-background);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: grab;

  &:hover {
    box-shadow: 0 0 0 8px rgba(var(--color-ring), 0.5);
  }

  &:focus-visible {
    box-shadow: 0 0 0 8px rgba(var(--color-ring), 0.5);
    outline: none;
  }

  &:active {
    cursor: grabbing;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onValueChange'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  disabled?: boolean;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ 
    className, 
    value, 
    defaultValue = [0], 
    onValueChange,
    max = 100, 
    min = 0, 
    step = 1,
    disabled = false,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(value || defaultValue);
    const currentValue = value || internalValue;

    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      const rect = event.currentTarget.getBoundingClientRect();
      const percentage = (event.clientX - rect.left) / rect.width;
      const newValue = Math.round((min + percentage * (max - min)) / step) * step;
      const clampedValue = Math.max(min, Math.min(max, newValue));
      
      const newValues = [clampedValue];
      setInternalValue(newValues);
      onValueChange?.(newValues);
    }, [disabled, min, max, step, onValueChange]);

    const percentage = ((currentValue[0] - min) / (max - min)) * 100;

    return (
      <SliderBase
        ref={ref}
        className={clsx(className)}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <SliderTrack>
          <SliderRange percentage={percentage} />
        </SliderTrack>
        <SliderThumb position={percentage} />
      </SliderBase>
    );
  }
);

Slider.displayName = "Slider";