import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UiService {
    activeSection = signal<string>('');

    setActiveSection(section: string) {
        this.activeSection.set(section);
    }
}
