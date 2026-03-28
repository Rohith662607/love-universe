import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scene-container" style="z-index:200; background:var(--bg); flex-direction:column; gap:32px; text-align:center;">
      <div class="loader-ring"></div>
      <div class="loader-text">initializing your universe…</div>
    </div>
  `,
  styles: [`
    .loader-ring {
      width: 80px; height: 80px;
      border: 1px solid rgba(232,201,160,0.15);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 2s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loader-text {
      font-family: var(--font-mono);
      font-size: 0.7rem; letter-spacing: 0.3em;
      color: var(--muted); text-transform: uppercase;
    }
  `]
})
export class LoaderComponent implements OnInit {
  @Output() loaded = new EventEmitter<void>();

  ngOnInit(): void {
    setTimeout(() => this.loaded.emit(), 2200);
  }
}
