import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
  pulseDirection: number;
  colorPhase: number;
  originalX: number;
  originalY: number;
  isRepelled: boolean;
  repelForce: { x: number; y: number };
  id: number;
}

// Global state to persist particles across component remounts
let globalParticles: Particle[] = [];
let globalAnimationId: number | null = null;
let touchActive = false;
let lastTouchTime = 0;

interface ParticleNetworkProps {
  className?: string;
}

export const ParticleNetwork = ({ className = '' }: ParticleNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const lastCanvasSizeRef = useRef<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    const createParticles = () => {
      const rect = canvas.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      
      // Check if we should reuse existing particles
      const shouldReuseParticles = globalParticles.length > 0 && 
        lastCanvasSizeRef.current &&
        Math.abs(lastCanvasSizeRef.current.width - rect.width) < 50 &&
        Math.abs(lastCanvasSizeRef.current.height - rect.height) < 50;
      
      if (shouldReuseParticles) {
        // Reuse existing particles and adjust their bounds
        globalParticles.forEach(particle => {
          // Keep particles within new bounds
          if (particle.x > rect.width) particle.x = rect.width - 10;
          if (particle.y > rect.height) particle.y = rect.height - 10;
          if (particle.originalX > rect.width) particle.originalX = rect.width - 10;
          if (particle.originalY > rect.height) particle.originalY = rect.height - 10;
        });
        particlesRef.current = globalParticles;
      } else {
        // Create new particles
        const particles: Particle[] = [];
        const numParticles = isMobile ? 
          Math.floor((rect.width * rect.height) / 1500) : 
          Math.floor((rect.width * rect.height) / 1000);
        
        for (let i = 0; i < numParticles; i++) {
          const x = Math.random() * rect.width;
          const y = Math.random() * rect.height;
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
            vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
            pulse: Math.random() * Math.PI * 2,
            pulseDirection: 1,
            colorPhase: Math.random() * Math.PI * 2,
            originalX: x,
            originalY: y,
            isRepelled: false,
            repelForce: { x: 0, y: 0 },
            id: i
          });
        }
        
        globalParticles = particles;
        particlesRef.current = particles;
      }
      
      lastCanvasSizeRef.current = { width: rect.width, height: rect.height };
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      // Update and draw particles
      particles.forEach(particle => {
        // Handle mouse repelling effect - more sensitive and responsive
        if (mouse) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 150; // Increased radius for more responsive interaction
          
          if (distance < repelRadius && distance > 0) {
            // Calculate repelling force with exponential curve for better feel
            const normalizedDistance = distance / repelRadius;
            const force = Math.pow(1 - normalizedDistance, 2.5); // Steeper curve for immediate response
            const repelStrength = 6; // Higher strength for instant visibility
            const minForce = 0.5; // Minimum force to ensure immediate response
            const calculatedForce = Math.max(force, minForce);
            particle.repelForce.x = (dx / distance) * calculatedForce * repelStrength;
            particle.repelForce.y = (dy / distance) * calculatedForce * repelStrength;
            particle.isRepelled = true;
          } else {
            // Gradually reduce repelling force when mouse moves away
            particle.repelForce.x *= 0.94;
            particle.repelForce.y *= 0.94;
            if (Math.abs(particle.repelForce.x) < 0.01 && Math.abs(particle.repelForce.y) < 0.01) {
              particle.isRepelled = false;
              particle.repelForce.x = 0;
              particle.repelForce.y = 0;
            }
          }
        } else {
          // Mouse not present, gradually return to original position
          particle.repelForce.x *= 0.92;
          particle.repelForce.y *= 0.92;
          if (Math.abs(particle.repelForce.x) < 0.01 && Math.abs(particle.repelForce.y) < 0.01) {
            particle.isRepelled = false;
            particle.repelForce.x = 0;
            particle.repelForce.y = 0;
          }
          
          // Gentle attraction back to original position when mouse is away
          if (!particle.isRepelled) {
            const returnForce = 0.02;
            const dx = particle.originalX - particle.x;
            const dy = particle.originalY - particle.y;
            particle.x += dx * returnForce;
            particle.y += dy * returnForce;
          }
        }
        
        // Apply repelling force to particle movement
        particle.x += particle.repelForce.x;
        particle.y += particle.repelForce.y;
        
        // Update position - faster movement
        particle.x += particle.vx * 2.5;
        particle.y += particle.vy * 2.5;
        
        // Update pulse - faster animation
        particle.pulse += 0.08 * particle.pulseDirection;
        if (particle.pulse > Math.PI * 2) {
          particle.pulse = 0;
        }
        
        // Update color phase - faster color transitions
        particle.colorPhase += 0.03;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= rect.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(rect.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= rect.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(rect.height, particle.y));
        }
        
        // Draw particle with animated blue colors
        const pulseSize = 1.2 + Math.sin(particle.pulse) * 0.8;
        const baseAlpha = (0.5 + Math.sin(particle.pulse) * 0.3) * 0.8; // Brighter blue visibility
        
        // Enhance particle visibility when repelled by mouse
        const repelAlphaBoost = particle.isRepelled ? 0.3 : 0;
        const repelSizeBoost = particle.isRepelled ? 0.4 : 0;
        const alpha = Math.min(baseAlpha + repelAlphaBoost, 1);
        const enhancedPulseSize = pulseSize + repelSizeBoost;
        
        // Animated color mixing between deep blue and light blue
        const colorMix = (Math.sin(particle.colorPhase) + 1) / 2; // 0 to 1
        const darkBlue = { r: 0, g: 51, b: 160 }; // Deep blue (#0033a0)
        const lightBlue = { r: 37, g: 99, b: 235 }; // Light blue (#2563eb)
        
        const r = Math.round(darkBlue.r + (lightBlue.r - darkBlue.r) * colorMix);
        const g = Math.round(darkBlue.g + (lightBlue.g - darkBlue.g) * colorMix);
        const b = Math.round(darkBlue.b + (lightBlue.b - darkBlue.b) * colorMix);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, enhancedPulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
        
        // Add glow effect with complementary blue colors
        const glowProbability = particle.isRepelled ? 0.6 : 0.3; // More glow when repelled
        if (Math.random() < glowProbability) {
          const glowColorMix = (Math.sin(particle.colorPhase + Math.PI) + 1) / 2;
          const glowR = Math.round(darkBlue.r + (lightBlue.r - darkBlue.r) * glowColorMix);
          const glowG = Math.round(darkBlue.g + (lightBlue.g - darkBlue.g) * glowColorMix);
          const glowB = Math.round(darkBlue.b + (lightBlue.b - darkBlue.b) * glowColorMix);
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, enhancedPulseSize + 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${alpha * 0.3})`;
          ctx.fill();
        }
        
        // Draw complex multi-layered connections
        const isMobile = window.innerWidth < 768;
        const maxDistance = isMobile ? 140 : 200;
        const strongConnectionDistance = isMobile ? 70 : 100;
        
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance && distance > 0) {
            let opacity, lineWidth;
            let color;
            
            // Multiple connection layers with animated blue colors
            const connectionColorMix = (Math.sin(particle.colorPhase * 0.5) + 1) / 2;
            const darkBlue = { r: 0, g: 51, b: 160 }; // Deep blue
            const lightBlue = { r: 37, g: 99, b: 235 }; // Light blue
            
            // Enhance connections when particles are repelled by mouse
            const repelBonus = (particle.isRepelled || otherParticle.isRepelled) ? 0.4 : 0;
            
            if (distance < strongConnectionDistance * 0.5) {
              // Very close - bright strong connections
              opacity = (strongConnectionDistance * 0.5 - distance) / (strongConnectionDistance * 0.5) * 0.5 + repelBonus; // Dimmed + repel bonus
              lineWidth = 1.8;
              const r = Math.round(darkBlue.r + (lightBlue.r - darkBlue.r) * connectionColorMix);
              const g = Math.round(darkBlue.g + (lightBlue.g - darkBlue.g) * connectionColorMix);
              const b = Math.round(darkBlue.b + (lightBlue.b - darkBlue.b) * connectionColorMix);
              color = `rgba(${r}, ${g}, ${b}, ${Math.min(opacity, 1)})`;
            } else if (distance < strongConnectionDistance) {
              // Close - medium connections
              opacity = (strongConnectionDistance - distance) / strongConnectionDistance * 0.3 + repelBonus; // Dimmed + repel bonus
              lineWidth = 1.2;
              const r = Math.round(darkBlue.r + (lightBlue.r - darkBlue.r) * connectionColorMix);
              const g = Math.round(darkBlue.g + (lightBlue.g - darkBlue.g) * connectionColorMix);
              const b = Math.round(darkBlue.b + (lightBlue.b - darkBlue.b) * connectionColorMix);
              color = `rgba(${r}, ${g}, ${b}, ${Math.min(opacity, 1)})`;
            } else {
              // Far - weak connections for network density
              opacity = (maxDistance - distance) / maxDistance * 0.15 + repelBonus; // Dimmed + repel bonus
              lineWidth = 0.6;
              const r = Math.round(darkBlue.r + (lightBlue.r - darkBlue.r) * connectionColorMix);
              const g = Math.round(darkBlue.g + (lightBlue.g - darkBlue.g) * connectionColorMix);
              const b = Math.round(darkBlue.b + (lightBlue.b - darkBlue.b) * connectionColorMix);
              color = `rgba(${r}, ${g}, ${b}, ${Math.min(opacity, 1)})`;
            }
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
        });
      });
      
      globalAnimationId = requestAnimationFrame(animate);
      animationRef.current = globalAnimationId;
    };

    // Initialize
    resizeCanvas();
    createParticles();
    
    // Cancel any existing global animation
    if (globalAnimationId) {
      cancelAnimationFrame(globalAnimationId);
    }
    
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    // Mouse/touch interaction handlers - optimized for immediate response
    const updateMousePosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
      // Force immediate animation frame for instant response
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animate();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      if (touch) {
        touchActive = true;
        lastTouchTime = Date.now();
        updateMousePosition(touch.clientX, touch.clientY);
        // Force immediate animation frame for instant response
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animate();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      if (touch && touchActive) {
        lastTouchTime = Date.now();
        updateMousePosition(touch.clientX, touch.clientY);
        // Force immediate animation frame for continuous response
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animate();
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    const handleTouchEnd = () => {
      touchActive = false;
      mouseRef.current = null;
    };

    const handleTouchCancel = () => {
      touchActive = false;
      mouseRef.current = null;
    };

    // Add event listeners for interaction
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ 
        zIndex: 1,
        touchAction: 'none',
        pointerEvents: 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    />
  );
};