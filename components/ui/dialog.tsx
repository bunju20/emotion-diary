import React, { forwardRef, useEffect, createContext, useContext } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { clsx } from 'clsx';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const scaleOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

const StyledDialogOverlay = styled.div<{ open?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.5);
  animation: ${props => props.open ? fadeIn : fadeOut} 0.2s ease-in-out;
`;

const StyledDialogContent = styled.div<{ open?: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: calc(100% - 2rem);
  transform: translate(-50%, -50%);
  gap: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${props => props.open ? scaleIn : scaleOut} 0.2s ease-in-out;
  
  @media (min-width: 640px) {
    max-width: 32rem;
  }
`;

const StyledDialogClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 2px;
  opacity: 0.7;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.15s ease-in-out;
  outline: none;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--color-ring);
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
  }
`;

const StyledDialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

const StyledDialogFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const StyledDialogTitle = styled.h2`
  font-size: 1.125rem;
  line-height: 1;
  font-weight: 600;
`;

const StyledDialogDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
`;

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogContext = createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Dialog({ open = false, onOpenChange = () => {}, children }: DialogProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
        <StyledDialogOverlay open={open} onClick={() => onOpenChange(false)} />
        {children}
      </div>
    </DialogContext.Provider>
  );
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useContext(DialogContext);
    
    return (
      <StyledDialogContent
        ref={ref}
        open={open}
        className={clsx(className)}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        <StyledDialogClose onClick={() => onOpenChange(false)}>
          ✕
          <span style={{ position: 'absolute', left: '-9999px' }}>Close</span>
        </StyledDialogClose>
      </StyledDialogContent>
    );
  }
);

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <StyledDialogHeader
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <StyledDialogFooter
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <StyledDialogTitle
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <StyledDialogDescription
      ref={ref}
      className={clsx(className)}
      {...props}
    />
  )
);

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogFooter.displayName = "DialogFooter";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";