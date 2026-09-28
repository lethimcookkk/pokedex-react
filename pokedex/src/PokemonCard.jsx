import React, { useState, useRef } from 'react';
import './PokemonCard.css';

export default function PokemonCard({ card }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.6 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const isEX = card?.subtypes?.includes('EX') || card?.name?.includes('EX');
  const isHolo = card?.rarity?.toLowerCase().includes('holo') || isEX;

  return (
    <div className="card-container">
      <div
        ref={cardRef}
        className={`pokemon-card ${isHolo ? 'holo' : ''} ${isEX ? 'ex-card' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        <img src={card?.images?.large} alt={card?.name} className="card-image" />
        <div
          className="holo-overlay"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 0, 128, 0.3) 20%, rgba(0, 255, 255, 0.3) 40%, transparent 80%)`,
            opacity: glare.opacity,
          }}
        />
      </div>
    </div>
  );
}