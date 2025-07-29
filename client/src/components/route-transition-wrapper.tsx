import { PageTransition } from './page-transition';
import { ReactNode } from 'react';

interface RouteTransitionWrapperProps {
  children: ReactNode;
  excludeTransition?: boolean;
}

export function RouteTransitionWrapper({ children, excludeTransition = false }: RouteTransitionWrapperProps) {
  return (
    <PageTransition shouldAnimate={!excludeTransition}>
      {children}
    </PageTransition>
  );
}

// Helper component for routes that should have transitions
export function TransitionRoute({ children }: { children: ReactNode }) {
  return (
    <RouteTransitionWrapper>
      {children}
    </RouteTransitionWrapper>
  );
}

// Helper component for routes that should NOT have transitions (mobile main pages)
export function NoTransitionRoute({ children }: { children: ReactNode }) {
  return (
    <RouteTransitionWrapper excludeTransition={true}>
      {children}
    </RouteTransitionWrapper>
  );
}