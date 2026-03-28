import {
  Component, OnInit, OnDestroy,
  AfterViewInit, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-distance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container scene-enter"
      style="flex-direction:column; padding:40px; align-items:center; justify-content:center;">

      <div class="distance-wrap">
        <div style="text-align:center;">
          <div class="label-mono" style="margin-bottom:16px;">the space between us</div>
          <div class="scene-title" style="font-size:clamp(2rem,5vw,4rem);">
            Miles Apart,<br/>
            <em style="color:var(--rose); font-style:italic;">Hearts Together</em>
          </div>
        </div>

        <!-- Visual dots -->
        <div class="distance-visual">
          <div class="distance-dot you" title="You"></div>
          <div class="distance-line">
            <div class="distance-heart">♥</div>
          </div>
          <div class="distance-dot me" title="Me"></div>
        </div>

        <!-- Quote carousel -->
        <div class="quote-carousel">
          <div
            *ngFor="let q of quotes; let i = index"
            class="carousel-quote"
            [class.active]="i === activeQuoteIdx">
            <span class="quote-text" style="font-size:clamp(1rem,2.2vw,1.4rem);">
              "{{ q }}"
            </span>
          </div>
        </div>

        <div class="poem-text" style="max-width:520px; font-size:clamp(1rem,2vw,1.4rem);">
          Each message sent, each voice I hear,<br/>
          It draws you close, brings you near.<br/>
          Though time may fly, one truth will stay—<br/>
          I'll love you more with each new day.
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

    .distance-wrap {
      max-width: 700px; text-align: center;
      display: flex; flex-direction: column;
      gap: 44px; align-items: center;
    }

    .distance-visual {
      position: relative; width: 240px; height: 80px;
      display: flex; align-items: center; justify-content: space-between;
    }

    .distance-dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 1px solid var(--accent);
    }
    .distance-dot.you { background: var(--gold); box-shadow: 0 0 20px var(--gold); }
    .distance-dot.me  { background: var(--rose); box-shadow: 0 0 20px var(--rose); }

    .distance-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, var(--gold), transparent 40%, transparent 60%, var(--rose));
      position: relative;
    }

    .distance-heart {
      position: absolute; left: 50%; top: 50%;
      transform: translate(-50%,-50%);
      font-size: 1rem;
      animation: heartBeat 2s ease-in-out infinite;
    }
    @keyframes heartBeat {
      0%,100%{transform:translate(-50%,-50%) scale(1); opacity:0.6}
      50%{transform:translate(-50%,-50%) scale(1.4); opacity:1}
    }

    .quote-carousel {
      position: relative; min-height: 80px;
      width: 100%; display: flex;
      align-items: center; justify-content: center;
    }

    .carousel-quote {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.8s;
    }
    .carousel-quote.active { opacity: 1; }

    @media (max-width: 480px) {
      .distance-visual { width: 180px; }
    }
  `]
})
export class DistanceComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() next = new EventEmitter<void>();

  quotes: string[] = [];
  activeQuoteIdx = 0;
  private carouselTimer: any;

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.quotes = this.data.getDistanceQuotes();
  }

  ngAfterViewInit(): void {
    gsap.fromTo('.distance-wrap > *',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.7, ease: 'power2.out', delay: 0.3 }
    );

    this.carouselTimer = setInterval(() => {
      this.activeQuoteIdx = (this.activeQuoteIdx + 1) % this.quotes.length;
    }, 3000);
  }

  onNext(): void { this.next.emit(); }

  ngOnDestroy(): void { clearInterval(this.carouselTimer); }
}
