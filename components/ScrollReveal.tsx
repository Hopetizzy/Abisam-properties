
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'scale-up' | 'none';
  delay?: number;
  className?: string;
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0,
  className = "",
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && domRef.current) observer.unobserve(domRef.current);
        } else if (!once) {
          setIsVisible(false);
        }
      });
    }, { threshold: 0.15 });

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [once]);

  const getAnimationClass = () => {
    if (animation === 'none') return '';
    const base = animation === 'scale-up' ? 'reveal-scale-hidden' : 'reveal-hidden';
    const active = animation === 'scale-up' ? 'reveal-scale-visible' : 'reveal-visible';
    return `${base} ${isVisible ? active : ''}`;
  };

  return (
    <div 
      ref={domRef} 
      className={`${getAnimationClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;