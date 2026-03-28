import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SceneService {
  readonly totalScenes = 9;

  private _current = new BehaviorSubject<number>(0); // 0 = loader
  current$ = this._current.asObservable();

  private _isTransitioning = new BehaviorSubject<boolean>(false);
  isTransitioning$ = this._isTransitioning.asObservable();

  get current(): number { return this._current.value; }

  navigateTo(scene: number): void {
    if (this._isTransitioning.value) return;
    if (scene < 1 || scene > this.totalScenes) return;

    this._isTransitioning.next(true);
    const prev = this._current.value;
    this._current.next(scene);

    // Allow transitions to complete
    setTimeout(() => this._isTransitioning.next(false), 900);
  }

  next(): void {
    if (this.current < this.totalScenes) this.navigateTo(this.current + 1);
  }

  previous(): void {
    if (this.current > 1) this.navigateTo(this.current - 1);
  }

  getProgress(): number {
    if (this.current === 0) return 0;
    return ((this.current - 1) / (this.totalScenes - 1)) * 100;
  }
}
