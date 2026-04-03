"use client"
import React, { useEffect, useRef, useState } from "react";

interface LinkItem {
  href: string;
  label: string;
}

interface FooterProps {
  leftLinks: LinkItem[];
  rightLinks: LinkItem[];
  copyrightText: string;
  barCount?: number;
  barColor?: string;
}

const Footer: React.FC<FooterProps> = ({
  leftLinks,
  rightLinks,
  copyrightText,
  barCount = 23,
  barColor = "#F5C842",
}) => {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const currentRef = footerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    let t = 0;

    const animateWave = () => {
      const waveElements = waveRefs.current;
      let offset = 0;

      waveElements.forEach((element, index) => {
        if (element) {
          offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
          element.style.transform = `translateY(${index + offset}px)`;
        }
      });

      t += 0.1;
      animationFrameRef.current = requestAnimationFrame(animateWave);
    };

    if (isVisible) {
      animateWave();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative flex flex-col w-full justify-between select-none"
      style={{ background: '#060608' }}
    >
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row justify-between gap-8 pb-24 pt-12 px-8">
        <div className="space-y-4">
          <div className="font-display font-800 text-xl tracking-tight mb-6" style={{ color: '#F8F4ED' }}>
            FIN<span style={{ color: '#F5C842' }}>VAULT</span>
          </div>
          <ul className="flex flex-wrap gap-4">
            {leftLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-sm font-body hover:text-gold-400 transition-colors" style={{ color: 'rgba(248,244,237,0.5)' }}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm font-body flex items-center gap-x-2" style={{ color: 'rgba(248,244,237,0.3)' }}>
            <span style={{ color: '#F5C842' }}>◈</span>
            {copyrightText}
          </p>
        </div>
        <div className="space-y-4">
          <ul className="flex flex-wrap gap-4">
            {rightLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-sm font-body hover:text-gold-400 transition-colors" style={{ color: 'rgba(248,244,237,0.5)' }}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="text-right mt-4">
            <button onClick={scrollToTop} className="text-sm font-body hover:text-gold-400 transition-colors inline-flex items-center gap-1" style={{ color: 'rgba(248,244,237,0.4)' }}>
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        style={{ overflow: "hidden", height: 200 }}
      >
        <div style={{ marginTop: 0 }}>
          {Array.from({ length: barCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => { waveRefs.current[index] = el; }}
              style={{
                height: `${index + 1}px`,
                backgroundColor: barColor,
                transition: "transform 0.1s ease",
                willChange: "transform",
                marginTop: "-2px",
                opacity: 0.15 + (index / barCount) * 0.85,
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
