import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="audio-player">
      <button class="audio-btn" (click)="audio.toggle()" [title]="audio.isPlaying ? 'Pause music' : 'Play music'">
        {{ audio.isPlaying ? '♫' : '♪' }}
      </button>
      <div class="audio-label">ambient</div>
    </div>
  `,
  styles: [`
    #audio-player {
      position: fixed; bottom: 24px; left: 24px;
      z-index: 200; display: flex; align-items: center;
      gap: 12px; animation: fadeIn 0.5s ease forwards;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }

    .audio-btn {
      width: 40px; height: 40px; border-radius: 50%;
      border: 1px solid rgba(232,201,160,0.25);
      background: rgba(3,2,10,0.8);
      color: var(--accent); font-size: 1rem;
      cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      transition: all 0.3s;
      &:hover { border-color: var(--accent); box-shadow: 0 0 20px rgba(212,166,90,0.2); }
    }

    .audio-label {
      font-family: var(--font-mono);
      font-size: 0.55rem; letter-spacing: 0.2em;
      color: rgba(232,201,160,0.35); text-transform: uppercase;
    }
  `]
})
export class AudioPlayerComponent {
  constructor(public audio: AudioService) {}
}
