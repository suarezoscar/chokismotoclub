import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../core/services/data';
import { AuthService } from '../../core/services/auth';
import { StorageService } from '../../core/services/storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
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
    date: [new Date().toISOString().slice(0, 16), Validators.required],
    imageUrl: ['']
  });
  merchForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    imageUrl: ['']
  });

  constructor() {
    // Load initial data
    this.dataService.getNews().subscribe(data => this.newsList.set(data));
    this.dataService.getMerch().subscribe(data => this.merchList.set(data));
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
      imageUrl: val.imageUrl || ''
    };

    if (this.editingNewsId()) {
      this.dataService.updateNews({ id: this.editingNewsId()!, ...newsData }).then(() => {
        this.cancelEditNews();
        alert('Noticia actualizada');
      });
    } else {
      this.dataService.addNews(newsData).then(() => {
        this.cancelEditNews(); // resets form
        alert('Noticia añadida');
      });
    }
  }

  editNews(item: any) {
    this.editingNewsId.set(item.id);
    this.newsForm.patchValue({
      title: item.title,
      content: item.content,
      type: item.type,
      date: item.date instanceof Date ? item.date.toISOString().slice(0, 16) : new Date(item.date.seconds * 1000).toISOString().slice(0, 16),
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
    this.newsForm.reset();
    this.newsForm.patchValue({ type: 'news', date: new Date().toISOString().slice(0, 16) });
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
