import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, query, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NewsEvent } from '../models/news-event.interface';
import { MerchItem } from '../models/merch-item.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private firestore = inject(Firestore);

  // News/Events
  getNews(): Observable<NewsEvent[]> {
    const newsCollection = collection(this.firestore, 'news');
    return new Observable<NewsEvent[]>((observer) => {
      const q = query(newsCollection);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsEvent));
        observer.next(data);
      }, (error) => {
        observer.error(error);
      });
      return () => unsubscribe();
    });
  }

  addNews(item: NewsEvent) {
    const newsCollection = collection(this.firestore, 'news');
    return addDoc(newsCollection, item);
  }

  deleteNews(id: string) {
    const docRef = doc(this.firestore, 'news', id);
    return deleteDoc(docRef);
  }

  updateNews(item: NewsEvent) {
    const docRef = doc(this.firestore, 'news', item.id!);
    const { id, ...data } = item;
    return updateDoc(docRef, data);
  }

  // Merch
  getMerch(): Observable<MerchItem[]> {
    const merchCollection = collection(this.firestore, 'merch');
    return new Observable<MerchItem[]>((observer) => {
      const q = query(merchCollection);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MerchItem));
        observer.next(data);
      }, (error) => {
        observer.error(error);
      });
      return () => unsubscribe();
    });
  }

  addMerch(item: MerchItem) {
    const merchCollection = collection(this.firestore, 'merch');
    return addDoc(merchCollection, item);
  }

  deleteMerch(id: string) {
    const docRef = doc(this.firestore, 'merch', id);
    return deleteDoc(docRef);
  }

  updateMerch(item: MerchItem) {
    const docRef = doc(this.firestore, 'merch', item.id!);
    const { id, ...data } = item;
    return updateDoc(docRef, data);
  }
}
