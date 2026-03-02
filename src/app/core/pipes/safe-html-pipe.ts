import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: unknown): SafeHtml {
    if (!value || typeof value !== 'string') return '';

    // In case the editor or database escaped the HTML string
    // e.g. '&lt;p&gt;' instead of '<p>'
    let decoded = value
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x2F;/g, "/");

    return this.sanitizer.bypassSecurityTrustHtml(decoded);
  }
}
