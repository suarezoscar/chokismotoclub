export interface NewsEvent {
    id?: string;
    title: string;
    date: any; // using any for Firestore Timestamp compatibility or Date
    content: string;
    imageUrl?: string;
    type: 'news' | 'event';
}
