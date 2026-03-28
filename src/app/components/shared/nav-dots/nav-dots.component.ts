import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-nav-dots',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="nav-dots">
      <div
        *ngFor="let dot of dots; let i = index"
        class="nav-dot"
        [class.active]="scene.current === i + 1"
        [title]="dot.label"
        (click)="scene.navigateTo(i + 1)">
      </div>
    </div>
  `,
  styles: [`
    #nav-dots {
      position: fixed; right: 28px; top: 50%;
      transform: translateY(-50%);
      z-index: 100; display: flex;
      flex-direction: column; gap: 12px;
      animation: fadeIn 0.5s ease forwards;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }

    .nav-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(232,201,160,0.25);
      cursor: pointer; transition: all 0.4s;
      border: 1px solid rgba(232,201,160,0.3);
    }
    .nav-dot.active { background: var(--accent); transform: scale(1.4); }
    .nav-dot:hover  { background: rgba(232,201,160,0.6); }

    @media (max-width: 480px) { #nav-dots { display: none; } }
  `]
})
export class NavDotsComponent {
  dots = [
    { label: 'Beginning' }, { label: 'The Bus Moment' },
    { label: 'Our World' }, { label: 'Distance' },
    { label: 'Why You' },   { label: 'Hidden Space' },
    { label: 'Future' },    { label: 'Star Game' },
    { label: 'Final Reveal' }
  ];

  constructor(public scene: SceneService) {}
}
