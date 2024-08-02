// smoke-effect.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-smoke-effect',
  templateUrl: './smoke-effect.component.html',
  styleUrls: ['./smoke-effect.component.scss'],
  standalone: true,
})
export class SmokeEffectComponent implements OnInit, AfterViewInit {
  private NUM_PARTICLES = 50;
  private particles: Particle[] = [];
  private fps = 30;
  private fpsInterval = 1000 / this.fps;
  private then = Date.now();
  private raf!: number;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private smokeImage = new Image();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.canvas = this.el.nativeElement.querySelector('#smoke-canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight + 100;
    }

    // Usar un blending mode adecuado para el humo sobre un fondo negro
    this.ctx.globalCompositeOperation = 'darken';

    this.smokeImage.src = '/assets/images/smoke.png'; // Asegúrate de que la ruta a la textura sea correcta
    this.smokeImage.onload = () => {
      this.init();
      this.animate();
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!reducedMotion.matches) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  init(): void {
    for (let i = 0; i < this.NUM_PARTICLES; i++) {
      this.particles.push(new Particle(this.canvas, this.ctx, this.smokeImage));
    }
  }

  handleParticles(): void {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();

      if (this.particles[i].size <= 1) {
        this.particles.splice(i, 1);
        i--;
        this.particles.push(
          new Particle(this.canvas, this.ctx, this.smokeImage)
        ); // Añadir nueva partícula para mantener el número
      }
    }
  }

  animate(): void {
    this.raf = requestAnimationFrame(this.animate.bind(this));

    const now = Date.now();
    const elapsed = now - this.then;

    if (elapsed > this.fpsInterval) {
      this.then = now - (elapsed % this.fpsInterval);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.handleParticles();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight + 100;
    cancelAnimationFrame(this.raf);
    this.handleParticles();
    this.animate();
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private smokeImage: HTMLImageElement
  ) {
    this.x = Math.random() * this.canvas.width - this.canvas.width;
    this.y = Math.random() * this.canvas.height - this.canvas.height / 2;
    this.size = Math.random() * 3000 + 1000;
    this.opacity = Math.random() * 0.5 + 0.5; // Aumentar la opacidad inicial
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.002;
  }

  update(): void {
    this.rotation += this.rotationSpeed;
  }

  draw(): void {
    this.ctx.save();
    this.ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
    this.ctx.rotate(this.rotation);
    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(
      this.smokeImage,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    );
    this.ctx.globalAlpha = 1.0;
    this.ctx.restore();
  }
}
