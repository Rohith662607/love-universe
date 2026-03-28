import {
  Component, AfterViewInit, OnDestroy,
  Output, EventEmitter, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { EffectsService } from '../../services/effects.service';

interface GameStar {
  x: number; y: number;
  r: number; speed: number;
  color: string; symbol: string;
}

@Component({
  selector: 'app-mini-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container scene-enter"
      style="flex-direction:column; padding:20px; text-align:center; gap:16px;">

      <div class="game-wrap">
        <div>
          <div class="label-mono" style="margin-bottom:8px;">collect our memories</div>
          <div class="scene-title" style="font-size:clamp(1.4rem,3vw,2.2rem);">Star Collector</div>
        </div>

        <div style="display:flex; gap:40px; align-items:center;">
          <div class="game-stat">Stars<br/><span>{{ score }}</span></div>
          <div class="game-stat">Goal<br/><span>{{ goal }}</span></div>
          <div class="game-stat">Time<br/><span [style.color]="timeLeft <= 10 ? 'var(--rose)' : 'var(--accent)'">{{ timeLeft }}</span></div>
        </div>

        <canvas #gameCanvas id="game-canvas" [width]="canvasW" [height]="canvasH"></canvas>

        <div class="scene-subtitle" style="font-size:0.9rem;">
          Move your cursor to collect falling stars — catch {{ goal }} to unlock our final message
        </div>

        <button class="btn-primary" *ngIf="!started" (click)="startGame()">start collecting ✦</button>
        <button class="btn-ghost" (click)="onNext()">skip to final reveal →</button>
      </div>

      <!-- Game Complete -->
      <div class="game-complete" [class.show]="gameWon">
        <div class="label-mono">✦ universe unlocked ✦</div>
        <div class="scene-title" style="font-size:clamp(1.6rem,4vw,3rem);">
          You collected<br/>
          <em style="color:var(--gold); font-style:italic;">all our stars ♥</em>
        </div>
        <div class="poem-text">
          You are the sunrise on Vizag shore,<br/>
          The echo in my ocean's roar.<br/>
          The prayer I whisper in the breeze,<br/>
          The calm that brings my soul to peace.
        </div>
        <button class="btn-primary" (click)="onNext()">see our ending ✦</button>
      </div>
    </div>
  `,
  styles: [`
    .scene-enter { animation: fadeInUp 0.8s ease-out forwards; }
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(30px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .game-wrap {
      display: flex; flex-direction: column;
      align-items: center; gap: 16px; width: 100%;
    }

    .game-stat {
      font-family: var(--font-mono); font-size: 0.7rem;
      letter-spacing: 0.2em; color: var(--muted); text-align: center;
      span { display: block; font-size: 1.4rem; color: var(--accent); margin-top: 4px; }
    }

    #game-canvas {
      border: 1px solid rgba(232,201,160,0.1);
      border-radius: 4px; background: rgba(0,0,0,0.3); cursor: none;
    }

    .game-complete {
      position: fixed; inset: 0; z-index: 400;
      background: rgba(3,2,10,0.95);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 32px; opacity: 0; pointer-events: none;
      text-align: center; padding: 40px;
      transition: opacity 0.5s;
    }
    .game-complete.show { opacity: 1; pointer-events: all; }

    @media (max-width: 768px) {
      #game-canvas { width: 340px !important; height: 280px !important; }
    }
  `]
})
export class MiniGameComponent implements AfterViewInit, OnDestroy {
  @Output() next = new EventEmitter<void>();
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  score = 0;
  goal = 15;
  timeLeft = 30;
  started = false;
  gameWon = false;
  canvasW = 560;
  canvasH = 360;

  private stars: GameStar[] = [];
  private playerX = 0;
  private running = false;
  private loopInterval: any;
  private spawnInterval: any;
  private timerInterval: any;

  private readonly COLORS = ['#e8c9a0', '#c97a8a', '#6b9bd1', '#d4a65a'];
  private readonly SYMBOLS = ['★', '✦', '♥', '✿'];

  constructor(private effects: EffectsService) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.playerX = this.canvasW / 2;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.playerX = e.clientX - rect.left;
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      this.playerX = e.touches[0].clientX - rect.left;
    }, { passive: false });

    // Draw idle state
    this.drawIdle();
  }

  private drawIdle(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    ctx.fillStyle = 'rgba(232,201,160,0.15)';
    ctx.font = '14px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('press start to collect stars', this.canvasW / 2, this.canvasH / 2);
  }

  startGame(): void {
    this.started = true;
    this.running = true;
    this.score = 0;
    this.timeLeft = 30;

    this.loopInterval = setInterval(() => this.gameLoop(), 50);
    this.spawnInterval = setInterval(() => this.spawnStar(), 700);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.endGame(this.score >= this.goal);
    }, 1000);
  }

  private spawnStar(): void {
    if (!this.running) return;
    this.stars.push({
      x: 30 + Math.random() * (this.canvasW - 60),
      y: -10,
      r: 8 + Math.random() * 8,
      speed: 1.5 + Math.random() * 2,
      color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
      symbol: this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)]
    });
  }

  private gameLoop(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const W = this.canvasW, H = this.canvasH;

    ctx.clearRect(0, 0, W, H);

    // Grid bg
    ctx.strokeStyle = 'rgba(232,201,160,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Move + draw stars
    const playerY = H - 40;
    const playerR = 22;

    this.stars = this.stars.filter(s => s.y < H + 20);
    this.stars.forEach(s => {
      s.y += s.speed;
      ctx.font = `${s.r * 2}px serif`;
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 10;
      ctx.fillText(s.symbol, s.x, s.y);
      ctx.shadowBlur = 0;

      // Collision
      const dx = s.x - this.playerX;
      const dy = s.y - playerY;
      if (Math.sqrt(dx * dx + dy * dy) < s.r + playerR) {
        this.score++;
        s.y = H + 20; // mark for removal
        if (this.score >= this.goal) this.endGame(true);
      }
    });

    // Player
    ctx.fillStyle = 'rgba(212,166,90,0.15)';
    ctx.strokeStyle = 'rgba(212,166,90,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.playerX, playerY, playerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = '18px serif';
    ctx.fillStyle = '#e8c9a0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♡', this.playerX, playerY);
  }

  private endGame(won: boolean): void {
    this.running = false;
    clearInterval(this.loopInterval);
    clearInterval(this.spawnInterval);
    clearInterval(this.timerInterval);

    if (won) {
      this.gameWon = true;
      this.effects.createConfetti();
    } else {
      // Time out without winning — offer to continue
      this.onNext();
    }
  }

  onNext(): void { this.next.emit(); }

  ngOnDestroy(): void {
    clearInterval(this.loopInterval);
    clearInterval(this.spawnInterval);
    clearInterval(this.timerInterval);
  }
}
