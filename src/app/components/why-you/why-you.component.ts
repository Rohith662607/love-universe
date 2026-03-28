import {
  Component, OnInit, AfterViewInit,
  Output, EventEmitter, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { DataService } from '../../services/data.service';
import { Poem } from '../../models/universe.models';

@Component({
  selector: 'app-why-you',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container" style="overflow:hidden;">

      <!-- Star field -->
      <div #starField class="star-field" style="position:absolute; inset:0;">
        <svg #constellationSvg
          style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;"></svg>

        <div
          *ngFor="let p of poems; let i = index"
          class="poem-star"
          [style.left.%]="starPositions[i].x"
          [style.top.%]="starPositions[i].y"
          (click)="openPoem(i)">
          <div class="star-dot"></div>
          <div class="star-label">Poem {{ p.num }}</div>
        </div>
      </div>

      <!-- Center title -->
      <div style="text-align:center; position:relative; z-index:5; pointer-events:none;">
        <div class="label-mono">the constellation of you</div>
        <div class="scene-title" style="font-size:clamp(1.8rem,4vw,3rem); margin-top:12px;">
          Every Star<br/>
          <em style="color:var(--gold); font-style:italic;">Is a Poem For You</em>
        </div>
      </div>

      <!-- Hint -->
      <div style="position:fixed; bottom:60px; left:50%; transform:translateX(-50%);
        font-family:var(--font-mono); font-size:0.6rem; letter-spacing:0.25em;
        color:rgba(232,201,160,0.25); text-transform:uppercase; z-index:50; pointer-events:none;">
        click the stars · discover poems
      </div>

      <button class="btn-primary"
        style="position:fixed; bottom:60px; right:48px; z-index:50;"
        (click)="onNext()">continue ✦</button>

      <!-- Poem popup -->
      <div class="poem-popup" [class.show]="popupOpen" (click)="closePopup()">
        <div class="poem-popup-inner" (click)="$event.stopPropagation()">
          <button
            style="position:absolute;top:20px;right:20px;font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.2em;color:var(--muted);background:none;border:none;cursor:pointer;text-transform:uppercase;"
            (click)="closePopup()">close ✕</button>

          <div style="font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.4em;color:rgba(212,166,90,0.4);text-transform:uppercase;">
            ✦ poem {{ selectedPoem?.num }} ✦
          </div>
          <div class="poem-text" [innerHTML]="formatPoem(selectedPoem?.lines || '')"></div>
          <div class="quote-text" style="font-size:0.95rem; color:rgba(232,201,160,0.5); margin-top:8px;">
            "{{ selectedPoem?.quote }}"
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .star-field { position: absolute; inset: 0; }

    .poem-popup {
      position: fixed; inset: 0; z-index: 300;
      background: rgba(3,2,10,0.9);
      backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.4s; padding: 40px;
    }
    .poem-popup.show { opacity: 1; pointer-events: all; }
    .poem-popup-inner {
      max-width: 520px; text-align: center;
      display: flex; flex-direction: column;
      gap: 32px; position: relative;
    }
  `]
})
export class WhyYouComponent implements OnInit, AfterViewInit {
  @Output() next = new EventEmitter<void>();
  @ViewChild('starField') starFieldRef!: ElementRef<HTMLDivElement>;
  @ViewChild('constellationSvg') svgRef!: ElementRef<SVGElement>;

  poems: Poem[] = [];
  starPositions: { x: number; y: number }[] = [];
  popupOpen = false;
  selectedPoem: Poem | null = null;

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.poems = this.data.getPoems();
    this.starPositions = this.poems.map(() => ({
      x: 8 + Math.random() * 82,
      y: 12 + Math.random() * 74
    }));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const stars = document.querySelectorAll('.poem-star');
      gsap.fromTo(stars,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(2)', delay: 0.3 }
      );
      this.drawConstellationLines();
    }, 100);
  }

  private drawConstellationLines(): void {
    const svg = this.svgRef.nativeElement;
    const w = window.innerWidth, h = window.innerHeight;

    for (let i = 0; i < this.starPositions.length - 1; i += 2) {
      const a = this.starPositions[i];
      const b = this.starPositions[i + 1];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(a.x / 100 * w));
      line.setAttribute('y1', String(a.y / 100 * h));
      line.setAttribute('x2', String(b.x / 100 * w));
      line.setAttribute('y2', String(b.y / 100 * h));
      line.setAttribute('stroke', 'rgba(232,201,160,0.07)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }
  }

  openPoem(i: number): void {
    this.selectedPoem = this.poems[i];
    this.popupOpen = true;
    setTimeout(() => {
      gsap.fromTo('.poem-popup-inner',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
    }, 10);
  }

  closePopup(): void { this.popupOpen = false; }

  formatPoem(lines: string): string {
    return lines.split('\n').join('<br/>');
  }

  onNext(): void { this.next.emit(); }
}
