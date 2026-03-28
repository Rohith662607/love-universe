import {
  Component, OnInit, AfterViewInit, OnDestroy,
  Output, EventEmitter, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { DataService } from '../../services/data.service';
import { EffectsService } from '../../services/effects.service';

@Component({
  selector: 'app-beginning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container scene-enter" style="flex-direction:column; gap:0; text-align:center; padding:40px;">
      <!-- background stars -->
      <div #starCluster class="star-cluster" style="position:absolute; width:100%; height:100%; pointer-events:none;"></div>

      <div style="max-width:640px; display:flex; flex-direction:column; align-items:center; gap:32px; position:relative; z-index:2;">
        <div class="label-mono">a universe is born</div>

        <div style="min-height:120px; display:flex; align-items:center;">
          <div class="scene-title" style="font-size:clamp(1.8rem,4vw,3rem); font-style:italic;" #typewriterEl>
            <span class="cursor-blink"></span>
          </div>
        </div>

        <div class="scene-subtitle" #subtitleEl style="opacity:0;">
          somewhere in the universe, two souls were written for each other
        </div>

        <button class="btn-primary" #ctaEl style="opacity:0;" (click)="onNext()">
          begin the journey ✦
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
    .cursor-blink {
      display: inline-block; width: 2px; height: 1em;
      background: var(--accent); margin-left: 4px;
      animation: blink 1s infinite; vertical-align: middle;
    }
    @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
  `]
})
export class BeginningComponent implements AfterViewInit, OnDestroy {
  @Output() next = new EventEmitter<void>();
  @ViewChild('starCluster') starClusterRef!: ElementRef<HTMLDivElement>;
  @ViewChild('typewriterEl') typewriterEl!: ElementRef<HTMLDivElement>;
  @ViewChild('subtitleEl') subtitleEl!: ElementRef<HTMLDivElement>;
  @ViewChild('ctaEl') ctaEl!: ElementRef<HTMLButtonElement>;

  private lines: string[] = [];
  private lineIdx = 0;
  private charIdx = 0;
  private timer: any;

  constructor(private data: DataService, private effects: EffectsService) {
    this.lines = this.data.getTypewriterLines();
  }

  ngAfterViewInit(): void {
    this.effects.createFloatingStars(this.starClusterRef.nativeElement, 40);
    setTimeout(() => this.typeChar(), 600);
  }

  private typeChar(): void {
    if (this.lineIdx >= this.lines.length) {
      setTimeout(() => {
        gsap.to(this.subtitleEl.nativeElement, { opacity: 0.7, y: 0, duration: 1, ease: 'power2.out' });
        gsap.fromTo(this.subtitleEl.nativeElement, { y: 10 }, { y: 0, duration: 1 });
        setTimeout(() => gsap.to(this.ctaEl.nativeElement, { opacity: 1, duration: 0.8 }), 600);
      }, 300);
      return;
    }

    const line = this.lines[this.lineIdx];
    if (this.charIdx < line.length) {
      const displayed = this.lines.slice(0, this.lineIdx).join('<br/>') +
        (this.lineIdx > 0 ? '<br/>' : '') +
        line.slice(0, this.charIdx + 1) +
        '<span class="cursor-blink"></span>';
      this.typewriterEl.nativeElement.innerHTML = displayed;
      this.charIdx++;
      this.timer = setTimeout(() => this.typeChar(), 55 + Math.random() * 30);
    } else {
      this.lineIdx++;
      this.charIdx = 0;
      this.timer = setTimeout(() => this.typeChar(), 400);
    }
  }

  onNext(): void { this.next.emit(); }

  ngOnDestroy(): void { clearTimeout(this.timer); }
}
