import React from 'react';
import cryptoIconsImage from '@assets/d2b8f2d65b7a4cc2bdb4dade8ff17964_1752876325562.png';

export const CryptoCoinList = () => {
  return (
    <section className="py-0 relative overflow-hidden z-20" style={{
      backgroundImage: `url('/attached_assets/Screenshot_20250718-030008_Phoenix_1752804174994.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Top blur effect blending with background */}
      <div className="absolute top-0 left-0 right-0 h-24 z-30" style={{
        backgroundImage: `url('/attached_assets/Screenshot_20250718-030008_Phoenix_1752804174994.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        maskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0) 100%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}></div>
      
      {/* Bottom blur effect blending with background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-30" style={{
        backgroundImage: `url('/attached_assets/Screenshot_20250718-030008_Phoenix_1752804174994.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        maskImage: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0) 100%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0) 100%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}></div>
      
      <div className="w-full h-full relative z-25">
        <img 
          src={cryptoIconsImage}
          alt="Cryptocurrency icons"
          className="w-full h-auto object-cover object-center"
          style={{ 
            minHeight: '300px',
            maxHeight: '600px',
            objectFit: 'contain'
          }}
        />
      </div>
    </section>
  );
};