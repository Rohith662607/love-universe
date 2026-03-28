import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EffectsService {

  createHeartBurst(cx: number, cy: number): void {
    const container = document.createElement('div');
    container.className = 'heart-burst';
    container.style.cssText = `position:fixed; left:${cx}px; top:${cy}px; pointer-events:none; z-index:999;`;
    document.body.appendChild(container);

    const symbols = ['♥', '✦', '♡', '★', '✿'];
    const colors = ['var(--gold)', 'var(--rose)', 'var(--accent)'];

    for (let i = 0; i < 12; i++) {
      const span = document.createElement('span');
      const angle = (i / 12) * Math.PI * 2;
      const dist = 60 + Math.random() * 80;
      span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      span.style.cssText = `
        position: absolute;
        font-size: 1.2rem;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
        animation: burstOut 1.5s ease-out forwards;
        animation-delay: ${Math.random() * 0.3}s;
        --tx: ${Math.cos(angle) * dist}px;
        --ty: ${Math.sin(angle) * dist}px;
      `;
      container.appendChild(span);
    }

    setTimeout(() => container.remove(), 2000);
  }

  createConfetti(): void {
    const colors = ['#e8c9a0', '#c97a8a', '#6b9bd1', '#d4a65a', '#f0e8dc'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 2}s;
        z-index: 998;
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  createFloatingStars(container: HTMLElement, count = 40): void {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'floating-star';
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s;
        animation-duration: ${2 + Math.random() * 2}s;
      `;
      container.appendChild(star);
    }
  }

  shakeElement(el: HTMLElement): void {
    el.style.transform = 'translateX(-8px)';
    const steps = [-8, 8, -6, 6, -4, 4, 0];
    let i = 0;
    const step = setInterval(() => {
      el.style.transform = `translateX(${steps[i]}px)`;
      i++;
      if (i >= steps.length) {
        clearInterval(step);
        el.style.transform = '';
      }
    }, 60);
  }
}
