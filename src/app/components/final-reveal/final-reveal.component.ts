import {
  Component, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { EffectsService } from '../../services/effects.service';

@Component({
  selector: 'app-final-reveal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container" style="flex-direction:column; padding:40px; text-align:center; overflow:hidden;">

      <div class="final-wrap">
        <div class="label-mono" #finalLabel style="opacity:0;">the universe · complete</div>

        <div #finalNames style="opacity:0;
          font-family:var(--font-display); font-size:clamp(1.6rem,4vw,3rem);
          font-weight:300; color:var(--soft); letter-spacing:0.1em; line-height:1.4;">
          Two souls · One universe<br/>
          <em style="color:var(--gold); font-style:italic;">Finally. Found.</em>
        </div>

        <div class="poem-text" #finalPoem style="opacity:0; max-width:560px; font-size:clamp(1.1rem,2.5vw,1.7rem);">
          Your name is the poem I never tire of writing —<br/>
          each syllable <em style="color:var(--gold);">a little more light</em> in whatever room I'm in.<br/>
          No rhyme scheme. No perfect ending.<br/>
          Just you, <em style="color:var(--gold);">living inside my heartbeat</em>, always.
        </div>

        <div class="quote-text" #finalQuote style="opacity:0; font-size:clamp(1.1rem,2.5vw,1.5rem);">
          "When I hold your hand, I am holding the entire universe in mine."
        </div>

        <!-- PROPOSAL BUTTON -->
        <button class="proposal-btn" #proposalBtn style="opacity:0;" (click)="openProposal()">
          Will you stay with me forever? ♥
        </button>

        <button class="btn-ghost" #finalRestart style="opacity:0;" (click)="onRestart()">
          relive the journey ↺
        </button>
      </div>
    </div>

    <!-- PROPOSAL OVERLAY -->
    <div class="proposal-overlay" [class.show]="proposalOpen">
      <div class="proposal-answer" #proposalAnswer></div>
      <div class="proposal-message" #proposalMessage style="opacity:0;"></div>
      <button class="btn-primary" style="margin-top:20px;" (click)="closeProposal()">
        hold this forever ✦
      </button>
    </div>
  `,
  styles: [`
    .final-wrap {
      max-width: 720px; display: flex;
      flex-direction: column; align-items: center; gap: 44px;
    }

    /* ── Proposal Button ── */
    .proposal-btn {
      font-family: var(--font-display);
      font-size: clamp(1.1rem, 2.5vw, 1.6rem);
      font-style: italic;
      letter-spacing: 0.06em;
      color: var(--bg);
      background: linear-gradient(135deg, var(--gold), var(--rose), var(--gold));
      border: none;
      padding: 20px 56px;
      border-radius: 60px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 0 40px rgba(212, 166, 90, 0.4);

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, var(--rose), var(--gold));
        opacity: 0;
        transition: opacity 0.4s;
      }

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 60px rgba(212, 166, 90, 0.7);
        &::before { opacity: 0.5; }
      }
    }

    /* ── Proposal Overlay ── */
    .proposal-overlay {
      position: fixed;
      inset: 0;
      z-index: 500;
      background: rgba(3, 2, 10, 0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      opacity: 0;
      pointer-events: none;
      transition: background 0.8s, opacity 0.8s;
      text-align: center;
      padding: 40px;

      &.show {
        opacity: 1;
        pointer-events: all;
        background: rgba(3, 2, 10, 0.97);
      }
    }

    .proposal-answer {
      font-family: var(--font-display);
      font-size: clamp(2rem, 6vw, 5rem);
      font-weight: 300;
      color: var(--gold);
      line-height: 1.2;
    }

    .proposal-message {
      font-family: var(--font-display);
      font-size: clamp(1.1rem, 2.5vw, 1.7rem);
      font-style: italic;
      color: var(--soft);
      max-width: 580px;
      line-height: 2;
    }

    @media (max-width: 768px) {
      .proposal-btn { font-size: 1rem; padding: 16px 36px; }
    }
  `]
})
export class FinalRevealComponent implements AfterViewInit {
  @Output() restart = new EventEmitter<void>();

  @ViewChild('finalLabel')   finalLabelRef!:   ElementRef;
  @ViewChild('finalNames')   finalNamesRef!:   ElementRef;
  @ViewChild('finalPoem')    finalPoemRef!:    ElementRef;
  @ViewChild('finalQuote')   finalQuoteRef!:   ElementRef;
  @ViewChild('proposalBtn')  proposalBtnRef!:  ElementRef;
  @ViewChild('finalRestart') finalRestartRef!: ElementRef;
  @ViewChild('proposalAnswer')  proposalAnswerRef!:  ElementRef;
  @ViewChild('proposalMessage') proposalMessageRef!: ElementRef;

  proposalOpen = false;

  constructor(private effects: EffectsService) {}

  ngAfterViewInit(): void {
    this.effects.createConfetti();

    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(this.finalLabelRef.nativeElement,   { opacity: 0.5, duration: 1 })
      .to(this.finalNamesRef.nativeElement,   { opacity: 1, duration: 1.3, ease: 'power2.out' }, '+=.3')
      .to(this.finalPoemRef.nativeElement,    { opacity: 1, duration: 1.6, ease: 'power2.out' }, '+=.5')
      .to(this.finalQuoteRef.nativeElement,   { opacity: 1, duration: 1,   ease: 'power2.out' }, '+=.4')
      .to(this.proposalBtnRef.nativeElement,  { opacity: 1, duration: 0.9, ease: 'back.out(1.5)' }, '+=.5')
      .to(this.finalRestartRef.nativeElement, { opacity: 1, duration: 0.7 }, '+=.3');

    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => this.effects.createHeartBurst(
          window.innerWidth  * (0.2 + Math.random() * 0.6),
          window.innerHeight * (0.3 + Math.random() * 0.4)
        ), i * 400);
      }
    }, 1000);
  }

  openProposal(): void {
    this.proposalOpen = true;

    // Fireworks
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.createFirework(
        window.innerWidth  * (0.1 + Math.random() * 0.8),
        window.innerHeight * (0.1 + Math.random() * 0.7)
      ), i * 250);
    }

    // Typewrite "Yes. A thousand times yes. ♥"
    const answerEl  = this.proposalAnswerRef.nativeElement  as HTMLElement;
    const messageEl = this.proposalMessageRef.nativeElement as HTMLElement;
    answerEl.textContent = '';
    messageEl.style.opacity = '0';

    const answerText = 'Yes. A thousand times yes. ♥';
    let idx = 0;
    gsap.fromTo(answerEl, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    const ticker = setInterval(() => {
      if (idx < answerText.length) {
        answerEl.textContent += answerText[idx++];
      } else {
        clearInterval(ticker);
        messageEl.innerHTML =
          'Every universe in existence — and I would choose yours.<br/>' +
          'Every life I could have lived — and I would choose the one beside you.<br/><br/>' +
          'This is not just yes. This is <em style="color:var(--gold);">always</em>.';
        gsap.to(messageEl, { opacity: 1, duration: 1.2, delay: 0.3 });

        this.effects.createConfetti();
        for (let i = 0; i < 5; i++) {
          setTimeout(() => this.effects.createHeartBurst(
            window.innerWidth  * (0.15 + Math.random() * 0.7),
            window.innerHeight * (0.2  + Math.random() * 0.6)
          ), i * 300);
        }
      }
    }, 60);
  }

  closeProposal(): void {
    this.proposalOpen = false;
  }

  onRestart(): void { this.restart.emit(); }

  // ── Firework effect ──
  private createFirework(cx: number, cy: number): void {
    const container = document.createElement('div');
    container.className = 'fw-container';
    container.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;pointer-events:none;z-index:490;`;
    document.body.appendChild(container);

    const colors = ['#e8c9a0', '#c97a8a', '#d4a65a', '#6b9bd1', '#f0e8dc'];
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement('div');
      const angle = (i / 20) * Math.PI * 2;
      const dist  = 60 + Math.random() * 80;
      spark.style.cssText = `
        position:absolute;
        width:4px; height:4px;
        border-radius:50%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        --tx:${Math.cos(angle) * dist}px;
        --ty:${Math.sin(angle) * dist}px;
        animation:burstOut 1.2s ease-out forwards;
        animation-delay:${Math.random() * 0.1}s;
      `;
      container.appendChild(spark);
    }
    setTimeout(() => container.remove(), 1500);
  }
}