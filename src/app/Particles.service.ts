import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParticlesService {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  ctx: CanvasRenderingContext2D;
  smokeImage: CanvasImageSource;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.x = Math.random() * canvas.width - canvas.width;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.size = Math.random() * 3000 + 1000; // Ajustar para textura y 'z'
    this.opacity = Math.random() * 0.8; // Opacidad inicial aleatoria
    this.rotation = Math.random() * Math.PI * 2; // Rotación inicial aleatoria
    this.rotationSpeed = Math.random() * 0.002; // Velocidad de rotación
    this.ctx = ctx;

    const image = new Image();
    image.src = './../../public/assets/images/smoke.png';

    this.smokeImage = image;
  }

  update() {
    this.rotation += this.rotationSpeed; // Actualizar la rotación
  }

  draw() {
    this.ctx.save(); // Guardar el estado actual del contexto
    this.ctx.translate(this.x + this.size / 2, this.y + this.size / 2); // Mover el origen al centro de la partícula
    this.ctx.rotate(this.rotation); // Rotar
    this.ctx.globalAlpha = this.opacity; // Opacidad
    this.ctx.drawImage(
      this.smokeImage,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    ); // Dibujar imagen
    this.ctx.globalAlpha = 1.0; // Restablecer opacidad
    this.ctx.restore(); // Restaurar el estado original del contexto
  }
}
