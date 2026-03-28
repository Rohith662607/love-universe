import {
  Component, OnInit, AfterViewInit,
  Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { DataService } from '../../services/data.service';
import { Memory } from '../../models/universe.models';

@Component({
  selector: 'app-our-world',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container scene-enter"
      style="flex-direction:column; padding:20px 40px; align-items:center; overflow:hidden;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:28px;width:100%;max-height:100vh;">
        <div style="text-align:center; flex-shrink:0;">
          <div class="label-mono" style="margin-bottom:10px;">our universe · memories</div>
          <div class="scene-title" style="font-size:clamp(1.8rem,4vw,3.2rem);">The World We Built</div>
        </div>

        <!-- Cards Grid -->
        <div class="world-scroll" style="width:100%;">
          <div class="world-grid">
            <div
              *ngFor="let mem of memories; let i = index"
              class="memory-card"
              [style.--card-glow]="mem.color"
              (click)="openModal(i)">
              <div style="font-size:2.2rem; line-height:1;">{{ mem.icon }}</div>
              <div style="font-family:var(--font-display); font-size:1.05rem; color:var(--accent); letter-spacing:0.05em;">
                {{ mem.title }}
              </div>
              <div style="font-family:var(--font-display); font-size:0.88rem; font-style:italic; color:var(--muted); line-height:1.7;">
                {{ firstTwoLines(mem.poem) }}
              </div>
            </div>
          </div>
        </div>

        <button class="btn-primary" style="flex-shrink:0;" (click)="onNext()">continue ✦</button>
      </div>

      <!-- Modal -->
      <div class="memory-expanded" [class.show]="modalOpen" (click)="closeModal()">
        <div class="memory-expanded-inner" (click)="$event.stopPropagation()">
          <button
            style="position:absolute;top:20px;right:20px;font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.2em;color:var(--muted);background:none;border:none;cursor:pointer;text-transform:uppercase;"
            (click)="closeModal()">close ✕</button>
          <div style="font-size:3rem;">{{ selectedMemory?.icon }}</div>
          <div class="scene-title" style="font-size:clamp(1.6rem,3vw,2.4rem);">{{ selectedMemory?.title }}</div>
          <div class="poem-text" [innerHTML]="formatPoem(selectedMemory?.poem || '')"></div>
          <div class="quote-text" style="font-size:1rem; color:var(--muted);">"{{ selectedMemory?.quote }}"</div>
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

    .world-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      max-width: 860px;
      margin: 0 auto;
    }

    .memory-expanded {
      position: fixed; inset: 0; z-index: 300;
      background: rgba(3,2,10,0.95);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.4s; padding: 40px;
    }
    .memory-expanded.show { opacity: 1; pointer-events: all; }
    .memory-expanded-inner {
      max-width: 560px; text-align: center;
      display: flex; flex-direction: column; gap: 24px;
      position: relative;
    }

    @media (max-width: 768px) {
      .world-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
      .world-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class OurWorldComponent implements OnInit, AfterViewInit {
  @Output() next = new EventEmitter<void>();

  memories: Memory[] = [];
  modalOpen = false;
  selectedMemory: Memory | null = null;

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.memories = this.data.getMemories();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      gsap.fromTo('.memory-card',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
      );
    }, 200);
  }

  firstTwoLines(poem: string): string {
    return poem.split('\n').slice(0, 2).join('\n');
  }

  formatPoem(poem: string): string {
    return poem.split('\n').join('<br/>');
  }

  openModal(i: number): void {
    this.selectedMemory = this.memories[i];
    this.modalOpen = true;
    setTimeout(() => {
      gsap.fromTo('.memory-expanded-inner',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
    }, 10);
  }

  closeModal(): void { this.modalOpen = false; }

  onNext(): void { this.next.emit(); }
}
