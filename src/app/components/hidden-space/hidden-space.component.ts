import {
  Component, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { DataService } from '../../services/data.service';
import { EffectsService } from '../../services/effects.service';

@Component({
  selector: 'app-hidden-space',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="scene-container scene-enter"
      style="flex-direction:column; gap:40px; text-align:center; padding:40px;">

      <div class="hidden-wrap">
        <div class="label-mono">secret constellation</div>

        <div class="lock-icon">🔐</div>

        <div class="scene-title" style="font-size:clamp(1.8rem,4vw,3rem);">Hidden Space</div>

        <div class="scene-subtitle">
          What do you call me when no one else can hear?
        </div>

        <input
          #pwInput
          type="password"
          class="password-input"
          [(ngModel)]="password"
          placeholder="enter our secret…"
          maxlength="20"
          (keydown.enter)="checkPassword()" />

        <div class="pw-error" [class.show]="showError">
          the stars didn't align… try again
        </div>

        <button class="btn-primary" (click)="checkPassword()">unlock ✦</button>
        <button class="btn-ghost" (click)="onNext()">skip for now →</button>
      </div>

      <!-- Secret Reveal overlay -->
      <div class="secret-reveal" [class.show]="revealOpen">
        <button class="close-btn" (click)="closeReveal()">close ✕</button>

        <div class="reveal-content">
          <div class="label-mono">for your eyes only ✦</div>

          <div class="scene-title" style="font-size:clamp(1.6rem,4vw,2.8rem);">
            A Letter<br/>
            <em style="color:var(--gold); font-style:italic;">Across the Distance</em>
          </div>

          <div class="secret-letter" #secretLetter style="opacity:0;">
            My love,<br/><br/>
            There are words I say in silence — in the pause before I fall asleep,
            in the space between heartbeats, in every moment I reach for my phone just to feel closer to you.<br/><br/>
            I never planned to fall in love. But there you were — on a bus seat, of all places —
            and the universe quietly rearranged itself around you.<br/><br/>
            You are not just a chapter in my story. You are the reason I wanted to write one.<br/><br/>
            Every distance is just space waiting to collapse. And when it does — I will hold your hand
            and we will look back at every poem, every night, every mile between us — and smile.
          </div>

          <div class="secret-signature" style="opacity:0;" #secretSig>
            — always, endlessly yours ♥
          </div>

          <button class="btn-primary" style="opacity:0;" #secretCta (click)="goToFuture()">
            continue to our future ✦
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scene-enter { animation: fadeInUp 0.8s ease-out forwards; }
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(30px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .hidden-wrap {
      max-width: 480px; display: flex;
      flex-direction: column; align-items: center; gap: 32px;
    }

    .lock-icon {
      width: 64px; height: 64px;
      border: 1px solid rgba(232,201,160,0.25);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; position: relative;
    }
    .lock-icon::before {
      content: ''; position: absolute; inset: -8px;
      border: 1px solid rgba(232,201,160,0.08);
      border-radius: 50%;
      animation: lockPulse 3s ease-in-out infinite;
    }
    @keyframes lockPulse {
      0%,100%{transform:scale(1);opacity:0.5}
      50%{transform:scale(1.15);opacity:1}
    }

    .password-input {
      width: 240px; background: transparent;
      border: none; border-bottom: 1px solid rgba(232,201,160,0.25);
      padding: 12px 0; font-family: var(--font-mono);
      font-size: 1.1rem; letter-spacing: 0.4em;
      color: var(--accent); text-align: center; outline: none;
      transition: border-color 0.3s;
      &:focus { border-bottom-color: var(--accent); }
      &::placeholder { letter-spacing: 0.3em; color: rgba(232,201,160,0.2); font-size: 0.7rem; }
    }

    .pw-error {
      font-family: var(--font-mono); font-size: 0.65rem;
      letter-spacing: 0.2em; color: var(--rose);
      opacity: 0; transition: opacity 0.3s;
      &.show { opacity: 1; }
    }

    /* Full-screen overlay */
    .secret-reveal {
      position: fixed;
      inset: 0;
      z-index: 400;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.8s;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .secret-reveal.show { opacity: 1; pointer-events: all; }

    /* Close button fixed to top-right */
    .close-btn {
      position: sticky;
      top: 0;
      align-self: flex-end;
      margin: 24px 32px 0 0;
      font-family: var(--font-mono);
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--muted);
      background: none;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      z-index: 10;
      flex-shrink: 0;
    }

    /* Scrollable content inside reveal */
    .reveal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 36px;
      text-align: center;
      padding: 32px 40px 80px;
      max-width: 700px;
      width: 100%;
    }

    .secret-letter {
      font-family: var(--font-display); font-size: clamp(1rem,2.2vw,1.4rem);
      font-weight: 300; font-style: italic;
      line-height: 2; color: var(--soft);
      max-width: 600px;
    }

    .secret-signature {
      font-family: var(--font-display);
      font-size: 1.8rem; font-style: italic;
      color: var(--gold);
    }
  `]
})
export class HiddenSpaceComponent implements AfterViewInit {
  @Output() next = new EventEmitter<void>();
  @ViewChild('pwInput') pwInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('secretLetter') secretLetterRef!: ElementRef;
  @ViewChild('secretSig') secretSigRef!: ElementRef;
  @ViewChild('secretCta') secretCtaRef!: ElementRef;

  password = '';
  showError = false;
  revealOpen = false;

  constructor(private data: DataService, private effects: EffectsService) {}

  ngAfterViewInit(): void {}

  checkPassword(): void {
    if (this.data.checkPassword(this.password)) {
      this.showError = false;
      this.revealOpen = true;

      setTimeout(() => {
        gsap.fromTo(this.secretLetterRef.nativeElement,
          { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.4 });
        gsap.fromTo(this.secretSigRef.nativeElement,
          { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.5 });
        gsap.fromTo(this.secretCtaRef.nativeElement,
          { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 2 });

        this.effects.createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
      }, 100);
    } else {
      this.showError = true;
      this.effects.shakeElement(this.pwInputRef.nativeElement);
      setTimeout(() => this.showError = false, 2500);
    }
  }

  closeReveal(): void { this.revealOpen = false; }

  goToFuture(): void {
    this.revealOpen = false;
    this.next.emit();
  }

  onNext(): void { this.next.emit(); }
}