import {
  Component, OnInit, AfterViewInit,
  Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-future-universe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container scene-enter"
      style="flex-direction:column; padding:40px; text-align:center;">

      <div class="future-wrap">
        <div>
          <div class="label-mono" style="margin-bottom:16px;">our next chapter</div>
          <div class="scene-title glow-gold" style="font-size:clamp(2rem,5vw,4rem);">
            The Universe<br/>
            <em style="color:var(--gold); font-style:italic;">We'll Build Together</em>
          </div>
        </div>

        <!-- Orbit system -->
        <div class="orbit-system">
          <div class="orbit-center"></div>
          <div class="orbit-ring" style="width:80px;height:80px;"></div>
          <div class="orbit-ring" style="width:130px;height:130px;"></div>
          <div class="orbit-ring" style="width:180px;height:180px;"></div>
          <div class="orbit-planet op1"></div>
          <div class="orbit-planet op2"></div>
          <div class="orbit-planet op3"></div>
        </div>

        <!-- Dream tags -->
        <div class="future-dreams">
          <div
            *ngFor="let d of dreams; let i = index"
            class="dream-tag"
            [class.lit]="litTags[i]">
            {{ d }}
          </div>
        </div>

        <div class="poem-text" style="max-width:520px; font-size:clamp(1rem,2vw,1.35rem);">
          No tale I've read could quite compare<br/>
          To the story that we've come to share.<br/>
          A tale of us, both raw and true,<br/>
          And every page begins with you.
        </div>

        <button class="btn-primary" (click)="onNext()">continue ✦</button>
      </div>
    </div>
  `,
  styles: [`
    .scene-enter { animation: fadeInUp 0.8s ease-out forwards; }
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(30px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .future-wrap {
      max-width: 680px; display: flex;
      flex-direction: column; align-items: center; gap: 44px;
    }

    .orbit-system {
      position: relative; width: 180px; height: 180px;
    }

    .orbit-center {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 24px; height: 24px;
      background: var(--gold); border-radius: 50%;
      box-shadow: 0 0 30px var(--gold);
    }

    .orbit-ring {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      border: 1px solid rgba(232,201,160,0.15);
      border-radius: 50%;
    }

    .future-dreams {
      display: flex; flex-wrap: wrap;
      gap: 10px; justify-content: center;
      max-width: 600px;
    }
  `]
})
export class FutureUniverseComponent implements OnInit, AfterViewInit {
  @Output() next = new EventEmitter<void>();

  dreams: string[] = [];
  litTags: boolean[] = [];

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.dreams = this.data.getFutureDreams();
    this.litTags = this.dreams.map(() => false);
  }

  ngAfterViewInit(): void {
    gsap.fromTo('.future-wrap > *',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.7, ease: 'power2.out', delay: 0.2 }
    );

    // Light up tags sequentially
    this.dreams.forEach((_, i) => {
      setTimeout(() => { this.litTags[i] = true; }, 400 + i * 160);
    });
  }

  onNext(): void { this.next.emit(); }
}
