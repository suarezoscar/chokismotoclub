import { Component } from '@angular/core';
import { SmokeEffectComponent } from './components/SmokeEffect/smoke-effect.component';
import { LogoComponent } from './components/logo/logo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SmokeEffectComponent, LogoComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
