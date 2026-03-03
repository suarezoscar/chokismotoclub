import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../core/services/data';
import { AuthService } from '../../core/services/auth';
import { StorageService } from '../../core/services/storage';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard {
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);

  activeTab = signal<'news' | 'merch'>('news');
  isUploading = signal(false);

  // Data signals
  newsList = signal<any[]>([]);
  merchList = signal<any[]>([]);

  // Edit state
  editingNewsId = signal<string | null>(null);
  editingMerchId = signal<string | null>(null);

  newsForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    type: ['news', Validators.required],
    date: [this.toLocalDatetimeString(new Date()), Validators.required],
    imageUrl: [''],
    locations: this.fb.array([])
  });

  merchForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    imageUrl: ['']
  });

  constructor() {
    this.dataService.getNews().subscribe(data => this.newsList.set(data));
    this.dataService.getMerch().subscribe(data => this.merchList.set(data));
  }

  /** Returns a datetime-local compatible string in LOCAL time (not UTC). */
  private toLocalDatetimeString(d: Date): string {
    const offsetMs = d.getTimezoneOffset() * 60_000;
    return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
  }

  get locationsArray(): FormArray {
    return this.newsForm.get('locations') as FormArray;
  }

  private createLocationGroup(label = '', maps = ''): FormGroup {
    return this.fb.group({
      label: [label, Validators.required],
      maps: [maps, Validators.required]
    });
  }

  addLocation(): void {
    this.locationsArray.push(this.createLocationGroup());
  }

  removeLocation(index: number): void {
    this.locationsArray.removeAt(index);
  }

  logout() {
    this.authService.logout();
  }

  uploadFile(event: Event, type: 'news' | 'merch') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isUploading.set(true);
    const path = type === 'news' ? 'news-images' : 'merch-images';

    this.storageService.uploadImage(file, path).subscribe({
      next: (url) => {
        if (type === 'news') {
          this.newsForm.patchValue({ imageUrl: url });
        } else {
          this.merchForm.patchValue({ imageUrl: url });
        }
        this.isUploading.set(false);
      },
      error: () => this.isUploading.set(false)
    });
  }

  // News Actions
  saveNews() {
    if (this.newsForm.invalid) return;
    const val = this.newsForm.value;
    const newsData = {
      title: val.title!,
      content: val.content!,
      type: val.type as 'news' | 'event',
      date: new Date(val.date!),
      imageUrl: val.imageUrl || '',
      locations: (val.locations as { label: string; maps: string }[]) ?? []
    };

    if (this.editingNewsId()) {
      this.dataService.updateNews({ id: this.editingNewsId()!, ...newsData }).then(() => {
        this.cancelEditNews();
        alert('Noticia actualizada');
      });
    } else {
      this.dataService.addNews(newsData).then(() => {
        this.cancelEditNews();
        alert('Noticia añadida');
      });
    }
  }

  editNews(item: any) {
    this.editingNewsId.set(item.id);

    // Reset locations array and repopulate from item
    while (this.locationsArray.length) {
      this.locationsArray.removeAt(0);
    }
    if (Array.isArray(item.locations)) {
      item.locations.forEach((loc: { label: string; maps: string }) => {
        this.locationsArray.push(this.createLocationGroup(loc.label, loc.maps));
      });
    }

    this.newsForm.patchValue({
      title: item.title,
      content: item.content,
      type: item.type,
      date: this.toLocalDatetimeString(
        item.date instanceof Date ? item.date : new Date(item.date.seconds * 1000)
      ),
      imageUrl: item.imageUrl
    });
  }

  deleteNews(id: string) {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
      this.dataService.deleteNews(id);
    }
  }

  cancelEditNews() {
    this.editingNewsId.set(null);
    while (this.locationsArray.length) {
      this.locationsArray.removeAt(0);
    }
    this.newsForm.reset();
    this.newsForm.patchValue({ type: 'news', date: this.toLocalDatetimeString(new Date()) });
  }

  // Merch Actions
  saveMerch() {
    if (this.merchForm.invalid) return;
    const val = this.merchForm.value;
    const merchData = {
      name: val.name!,
      description: val.description!,
      price: Number(val.price),
      imageUrl: val.imageUrl || '',
      isAvailable: true
    };

    if (this.editingMerchId()) {
      this.dataService.updateMerch({ id: this.editingMerchId()!, ...merchData }).then(() => {
        this.cancelEditMerch();
        alert('Producto actualizado');
      });
    } else {
      this.dataService.addMerch(merchData).then(() => {
        this.cancelEditMerch();
        alert('Producto añadido');
      });
    }
  }

  editMerch(item: any) {
    this.editingMerchId.set(item.id);
    this.merchForm.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl
    });
  }

  deleteMerch(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.dataService.deleteMerch(id);
    }
  }

  cancelEditMerch() {
    this.editingMerchId.set(null);
    this.merchForm.reset();
  }
}
