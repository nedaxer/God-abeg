import { ReactNode, useEffect } from 'react';

interface DesktopLayoutWrapperProps {
  children: ReactNode;
}

export default function DesktopLayoutWrapper({ children }: DesktopLayoutWrapperProps) {
  useEffect(() => {
    // Force full desktop layout
    const html = document.documentElement;
    const body = document.body;
    
    // Set full viewport
    html.style.width = '100%';
    html.style.height = '100%';
    html.style.margin = '0';
    html.style.padding = '0';
    
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.margin = '0';
    body.style.padding = '0';
    body.style.overflow = 'auto';
    
    // Desktop viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
    
    return () => {
      // Cleanup if needed
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="w-full min-h-screen" style={{ width: '100vw', minHeight: '100vh' }}>
      {children}
    </div>
  );
}