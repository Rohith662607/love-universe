import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-bus-moment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container scene-enter" style="flex-direction:column; align-items:center; justify-content:center; padding:40px; overflow:hidden;">
      <div class="bus-scene-wrap">
        <div class="label-mono" style="opacity:0.4; font-size:0.6rem; letter-spacing:0.4em;">
          origin point · 00°00'00"
        </div>

        <div class="scene-title glow-gold" #busTitle style="text-align:center; opacity:0;">
          The Bus Seat<br/>
          <em style="color:var(--rose); font-style:italic;">That Changed Everything</em>
        </div>

        <!-- Bus illustration -->
        <div class="bus-illustration" #busIllus style="opacity:0;">
          <div class="bus-body">
            <div class="bus-window"></div>
            <div class="bus-window special">
              <div class="bus-seat-glow"></div>
            </div>
            <div class="bus-window"></div>
          </div>
          <div class="bus-wheel left"></div>
          <div class="bus-wheel right"></div>
          <div class="bigbang-pulse" #bigbang></div>
          <div class="road-line"></div>
        </div>

        <div class="poem-text" #busPoem style="opacity:0;">
          A bus seat led me to my fate,<br/>
          Beside you, time began to wait.<br/>
          In every moment since that day,<br/>
          You turned my sky from grey to May.
        </div>

        <div class="quote-text" #busQuote style="font-size:1.1rem; opacity:0;">
          "Even a silent bus ride turned into a lifetime of emotions with you."
        </div>

        <button class="btn-primary" #busNext style="opacity:0;" (click)="onNext()">
          continue ✦
        </button>
      </div>
    </div>
  `,
  styles: [`
    .scene-enter { animation: fadeInUp 0.8s ease-out forwards; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .bus-scene-wrap {
      max-width: 700px; display: flex;
      flex-direction: column; align-items: center;
      gap: 36px; text-align: center; position: relative; z-index: 2;
    }

    .bus-illustration {
      position: relative; width: 300px; height: 160px;
    }
    .bus-body {
      width: 300px; height: 120px;
      background: linear-gradient(135deg, rgba(107,155,209,0.12), rgba(107,155,209,0.06));
      border: 1px solid rgba(107,155,209,0.3);
      border-radius: 16px 16px 8px 8px;
      position: absolute; bottom: 20px;
      box-shadow: 0 0 40px rgba(107,155,209,0.08);
    }
    .bus-window {
      position: absolute; top: 20px;
      width: 56px; height: 42px;
      background: rgba(107,155,209,0.08);
      border: 1px solid rgba(107,155,209,0.25);
      border-radius: 6px;
    }
    .bus-window:nth-child(1) { left: 24px; }
    .bus-window:nth-child(2) { left: 100px; }
    .bus-window:nth-child(3) { left: 176px; }
    .bus-window.special {
      background: rgba(232,201,160,0.12);
      border-color: rgba(232,201,160,0.3);
    }
    .bus-seat-glow {
      position: absolute; top: 14px; left: 96px;
      width: 64px; height: 50px;
      background: radial-gradient(ellipse, rgba(212,166,90,0.35), transparent);
      border-radius: 50%;
      animation: seatPulse 3s ease-in-out infinite;
    }
    @keyframes seatPulse {
      0%,100%{opacity:0.5;transform:scale(1)}
      50%{opacity:1;transform:scale(1.2)}
    }
    .bus-wheel {
      position: absolute; bottom: 0;
      width: 36px; height: 36px;
      background: rgba(107,155,209,0.1);
      border: 1px solid rgba(107,155,209,0.25);
      border-radius: 50%;
    }
    .bus-wheel.left  { left: 40px; }
    .bus-wheel.right { right: 40px; }
    .bigbang-pulse {
      position: absolute;
      width: 8px; height: 8px;
      background: var(--gold);
      border-radius: 50%;
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      box-shadow: 0 0 30px var(--gold), 0 0 60px rgba(212,166,90,0.5);
    }
    .road-line {
      position: absolute; bottom: 0; left: 50%;
      transform: translateX(-50%);
      width: 80%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(107,155,209,0.3), transparent);
    }

    @media (max-width: 768px) {
      .bus-illustration { transform: scale(0.8); }
      .bus-scene-wrap { gap: 24px; }
    }
  `]
})
export class BusMomentComponent implements AfterViewInit {
  @Output() next = new EventEmitter<void>();

  ngAfterViewInit(): void {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to('[data-ref="busTitle"]', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });

    // Query via DOM
    const title = document.querySelector('app-bus-moment .scene-title') as HTMLElement;
    const illus = document.querySelector('app-bus-moment .bus-illustration') as HTMLElement;
    const poem  = document.querySelector('app-bus-moment .poem-text') as HTMLElement;
    const quote = document.querySelector('app-bus-moment .quote-text') as HTMLElement;
    const btn   = document.querySelector('app-bus-moment .btn-primary') as HTMLElement;
    const bb    = document.querySelector('app-bus-moment .bigbang-pulse') as HTMLElement;

    if (title) gsap.fromTo(title,  { opacity:0, y:20 }, { opacity:1, y:0, duration:1, delay:0.3 });
    if (illus) gsap.fromTo(illus,  { opacity:0, scale:0.8 }, { opacity:1, scale:1, duration:1, delay:0.7, ease:'back.out(1.7)' });
    if (poem)  gsap.fromTo(poem,   { opacity:0, y:20 }, { opacity:1, y:0, duration:1, delay:1.1 });
    if (quote) gsap.fromTo(quote,  { opacity:0 }, { opacity:0.7, duration:0.8, delay:1.5 });
    if (btn)   gsap.fromTo(btn,    { opacity:0 }, { opacity:1, duration:0.6, delay:1.8 });

    if (bb) {
      gsap.fromTo(bb,
        { scale:1, opacity:1 },
        { scale:3, opacity:0, duration:2, repeat:-1, ease:'power2.out' }
      );
    }
  }

  onNext(): void { this.next.emit(); }
}
