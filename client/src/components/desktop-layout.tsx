import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTheme } from '@/contexts/theme-context';

interface DesktopLayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function DesktopLayout({ children, className = '', title = 'Nedaxer' }: DesktopLayoutProps) {
  const [location] = useLocation();
  const { getBackgroundClass, getTextClass } = useTheme();
  
  // Set up desktop viewport and styling
  useEffect(() => {
    // Set desktop viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    // Desktop-optimized viewport
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes');
    
    // Enhanced desktop styling
    const style = document.getElementById('desktop-layout-style') || document.createElement('style');
    style.id = 'desktop-layout-style';
    style.textContent = `
      @media screen and (min-width: 768px) {
        body {
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Desktop layout container */
        [data-layout="desktop"] {
          width: 100% !important;
          min-height: 100vh !important;
          background: linear-gradient(135deg, #0a0a2e 0%, #1a1a40 100%) !important;
          position: relative !important;
          overflow-x: hidden !important;
        }
        
        /* Desktop content wrapper */
        .desktop-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
        }
        
        /* Desktop header */
        .desktop-header {
          background: rgba(26, 26, 64, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        /* Desktop navigation */
        .desktop-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .desktop-nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .desktop-nav-link {
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }
        
        .desktop-nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f97316;
        }
        
        .desktop-nav-link.active {
          background: rgba(249, 115, 22, 0.2);
          color: #f97316;
        }
        
        /* Desktop card styling */
        .desktop-card {
          background: rgba(26, 26, 64, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          margin: 1rem 0;
          backdrop-filter: blur(10px);
        }
        
        /* Desktop grid layouts */
        .desktop-grid {
          display: grid;
          gap: 2rem;
          margin: 2rem 0;
        }
        
        .desktop-grid-2 {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .desktop-grid-3 {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        .desktop-grid-4 {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        
        /* Desktop button styles */
        .desktop-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          font-size: 1rem;
        }
        
        .desktop-btn-primary {
          background: #f97316;
          color: white;
        }
        
        .desktop-btn-primary:hover {
          background: #ea580c;
          transform: translateY(-2px);
        }
        
        .desktop-btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .desktop-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        /* Desktop responsive text */
        .desktop-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .desktop-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.8;
        }
        
        /* Desktop form styles */
        .desktop-form {
          background: rgba(26, 26, 64, 0.8);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .desktop-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        
        .desktop-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        
        /* Desktop sidebar */
        .desktop-sidebar {
          width: 280px;
          background: rgba(26, 26, 64, 0.8);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          overflow-y: auto;
          backdrop-filter: blur(10px);
        }
        
        .desktop-main {
          margin-left: 280px;
          padding: 2rem;
          min-height: 100vh;
        }
        
        /* Desktop mobile app viewer */
        .desktop-mobile-viewer {
          background: rgba(26, 26, 64, 0.8);
          border-radius: 24px;
          padding: 1rem;
          margin: 2rem auto;
          max-width: 400px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .desktop-mobile-content {
          background: #0a0a2e;
          border-radius: 16px;
          overflow: hidden;
          min-height: 600px;
          position: relative;
        }
      }
      
      /* Hide desktop styles on mobile */
      @media screen and (max-width: 767px) {
        .desktop-only {
          display: none !important;
        }
      }
    `;
    
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
    
    // Set document title
    document.title = title;
  }, [title]);
  
  return (
    <div data-layout="desktop" className={`${getBackgroundClass()} ${getTextClass()} ${className}`}>
      {children}
    </div>
  );
}