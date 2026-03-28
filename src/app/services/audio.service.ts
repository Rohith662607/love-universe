import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private _playing = false;

  get isPlaying(): boolean { return this._playing; }

  init(): void {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    const freqs = [110, 165, 220, 275, 330];
    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      oscGain.gain.setValueAtTime(0.05 / (i + 1), this.ctx!.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.gainNode!);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  play(): void {
    this.init();
    if (!this.gainNode || !this.ctx) return;
    this.gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 2);
    this._playing = true;
  }

  stop(): void {
    if (!this.gainNode || !this.ctx) return;
    this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
    this._playing = false;
  }

  toggle(): void {
    if (this._playing) this.stop();
    else this.play();
  }
}
