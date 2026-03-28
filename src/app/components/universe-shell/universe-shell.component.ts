import {
  Component, OnInit, OnDestroy, HostListener,
  ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import gsap from 'gsap';

import { SceneService } from '../../services/scene.service';
import { AudioService } from '../../services/audio.service';
import { EffectsService } from '../../services/effects.service';

import { LoaderComponent } from '../loader/loader.component';
import { BeginningComponent } from '../beginning/beginning.component';
import { BusMomentComponent } from '../bus-moment/bus-moment.component';
import { OurWorldComponent } from '../our-world/our-world.component';
import { DistanceComponent } from '../distance/distance.component';
import { WhyYouComponent } from '../why-you/why-you.component';
import { HiddenSpaceComponent } from '../hidden-space/hidden-space.component';
import { FutureUniverseComponent } from '../future-universe/future-universe.component';
import { MiniGameComponent } from '../mini-game/mini-game.component';
import { FinalRevealComponent } from '../final-reveal/final-reveal.component';
import { NavDotsComponent } from '../shared/nav-dots/nav-dots.component';
import { AudioPlayerComponent } from '../shared/audio-player/audio-player.component';

@Component({
  selector: 'app-universe-shell',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent, BeginningComponent, BusMomentComponent,
    OurWorldComponent, DistanceComponent, WhyYouComponent,
    HiddenSpaceComponent, FutureUniverseComponent, MiniGameComponent,
    FinalRevealComponent, NavDotsComponent, AudioPlayerComponent
  ],
  template: `
    <!-- Custom Cursor -->
    <div id="cursor"></div>
    <div id="cursor-ring"></div>

    <!-- Three.js Starfield Canvas -->
    <canvas #universeCanvas id="universe-canvas"></canvas>

    <!-- Progress Bar -->
    <div id="progress-bar" [style.width.%]="progress"></div>

    <!-- Nav Dots (hidden on loader) -->
    <app-nav-dots *ngIf="current >= 1" />

    <!-- Audio Player -->
    <app-audio-player *ngIf="current >= 1" />

    <!-- Konami Easter Egg -->
    <div id="konami-indicator" [class.visible]="konamiActive">✦ secret universe unlocked ✦</div>

    <!-- SCENES -->
    <app-loader    *ngIf="current === 0" (loaded)="onLoaded()" />
    <app-beginning *ngIf="current === 1" (next)="scene.next()" />
    <app-bus-moment *ngIf="current === 2" (next)="scene.next()" />
    <app-our-world  *ngIf="current === 3" (next)="scene.next()" />
    <app-distance   *ngIf="current === 4" (next)="scene.next()" />
    <app-why-you    *ngIf="current === 5" (next)="scene.next()" />
    <app-hidden-space *ngIf="current === 6" (next)="scene.next()" />
    <app-future-universe *ngIf="current === 7" (next)="scene.next()" />
    <app-mini-game  *ngIf="current === 8" (next)="scene.next()" />
    <app-final-reveal *ngIf="current === 9" (restart)="onRestart()" />
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }

    #progress-bar {
      position: fixed; bottom: 0; left: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--rose), var(--gold));
      z-index: 100;
      transition: width 0.5s ease;
      box-shadow: 0 0 12px var(--rose);
    }

    #konami-indicator {
      position: fixed; top: 20px; left: 50%;
      transform: translateX(-50%);
      font-family: var(--font-mono);
      font-size: 0.6rem; letter-spacing: 0.3em;
      color: var(--gold); z-index: 500;
      opacity: 0; transition: opacity 0.5s;
      text-transform: uppercase; pointer-events: none;
      &.visible { opacity: 1; }
    }
  `]
})
export class UniverseShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('universeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  current = 0;
  progress = 0;
  konamiActive = false;

  private subs: Subscription[] = [];
  private cursorX = 0; private cursorY = 0;
  private ringX = 0;   private ringY = 0;
  private rafId = 0;

  // Konami
  private readonly KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  private konamiIdx = 0;

  constructor(
    public scene: SceneService,
    private audio: AudioService,
    private effects: EffectsService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.scene.current$.subscribe(n => {
        this.current = n;
        this.progress = this.scene.getProgress();
      })
    );
  }

  ngAfterViewInit(): void {
    this.initCursor();
    this.initStarfield();
  }

  onLoaded(): void {
    this.scene.navigateTo(1);
  }

  onRestart(): void {
    this.scene.navigateTo(1);
  }

  // ============================================================
  // CURSOR
  // ============================================================
  private initCursor(): void {
    const cursor = document.getElementById('cursor')!;
    const ring   = document.getElementById('cursor-ring')!;

    document.addEventListener('mousemove', (e) => {
      this.cursorX = e.clientX; this.cursorY = e.clientY;
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
      cursor.style.width = '14px'; cursor.style.height = '14px';
      cursor.style.background = 'var(--rose)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.width = '8px'; cursor.style.height = '8px';
      cursor.style.background = 'var(--accent)';
    });

    const animateRing = () => {
      this.ringX += (this.cursorX - this.ringX) * 0.12;
      this.ringY += (this.cursorY - this.ringY) * 0.12;
      ring.style.left = this.ringX + 'px';
      ring.style.top  = this.ringY + 'px';
      this.rafId = requestAnimationFrame(animateRing);
    };
    animateRing();
  }

  // ============================================================
  // THREE.JS STARFIELD
  // ============================================================
  private initStarfield(): void {
    const canvas = this.canvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene3 = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 600;

    // Stars
    const count = 2000;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const col   = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = [[0.91,0.79,0.63],[0.79,0.48,0.54],[0.42,0.61,0.82],[0.94,0.91,0.86]];

    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 2000;
      pos[i*3+1] = (Math.random() - 0.5) * 2000;
      pos[i*3+2] = (Math.random() - 0.5) * 2000;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2];
      sizes[i] = Math.random() * 2 + 0.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
    const stars = new THREE.Points(geo, mat);
    scene3.add(stars);

    // Nebula
    const nGeo = new THREE.BufferGeometry();
    const np   = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) { np[i*3]=(Math.random()-0.5)*800; np[i*3+1]=(Math.random()-0.5)*400; np[i*3+2]=(Math.random()-0.5)*200-200; }
    nGeo.setAttribute('position', new THREE.BufferAttribute(np, 3));
    scene3.add(new THREE.Points(nGeo, new THREE.PointsMaterial({ size: 4, color: 0xc97a8a, transparent: true, opacity: 0.08 })));

    let tRotY = 0, tRotX = 0, time = 0;
    document.addEventListener('mousemove', e => {
      tRotY = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      tRotX = (e.clientY / window.innerHeight - 0.5) * 0.15;
    });

    const render = () => {
      requestAnimationFrame(render);
      time += 0.0005;
      stars.rotation.y += (tRotY - stars.rotation.y) * 0.02;
      stars.rotation.x += (tRotX - stars.rotation.x) * 0.02;
      stars.rotation.z  = time * 0.05;
      renderer.render(scene3, camera);
    };
    render();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ============================================================
  // KEYBOARD
  // ============================================================
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    // Navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  this.scene.next();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    this.scene.previous();

    // Konami
    if (e.key === this.KONAMI[this.konamiIdx]) {
      this.konamiIdx++;
      if (this.konamiIdx === this.KONAMI.length) {
        this.konamiIdx = 0;
        this.triggerKonami();
      }
    } else {
      this.konamiIdx = 0;
    }
  }

  private triggerKonami(): void {
    this.konamiActive = true;
    this.effects.createConfetti();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.effects.createHeartBurst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ), i * 200);
    }
    setTimeout(() => this.konamiActive = false, 3000);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    cancelAnimationFrame(this.rafId);
  }
}
