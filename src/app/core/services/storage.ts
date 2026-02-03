import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, switchMap, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private http = inject(HttpClient);
  private cloudName = environment.cloudinary.cloudName;
  private apiKey = environment.cloudinary.apiKey;
  private apiSecret = environment.cloudinary.apiSecret;

  uploadImage(file: File, path: string): Observable<string> {
    console.log('Starting upload to Cloudinary...', { fileName: file.name, fileSize: file.size, path });
    const timestamp = Math.round(new Date().getTime() / 1000);
    // Consolidate transformations: resize, pad, auto background, webp format
    const transformation = 'c_pad,h_600,w_800,b_auto,f_webp';

    // Signature: SHA-1(params + api_secret) sorted alphabetically
    // timestamp=..., transformation=...
    const paramsToSign = `timestamp=${timestamp}&transformation=${transformation}${this.apiSecret}`;

    return from(this.generateSignature(paramsToSign)).pipe(
      tap(signature => console.log('Generated signature:', signature)),
      switchMap(signature => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', this.apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('transformation', transformation);
        formData.append('signature', signature);
        // Optional: folder, public_id, etc. if needed
        // formData.append('folder', path); 

        return this.http.post<{ secure_url: string }>(
          `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
          formData
        );
      }),
      tap({
        next: (res) => console.log('Cloudinary upload success:', res),
        error: (err) => console.error('Cloudinary upload failed:', JSON.stringify(err))
      }),
      map(response => response.secure_url)
    );
  }

  private async generateSignature(str: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
