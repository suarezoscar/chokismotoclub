export interface NewsEvent {
    id?: string;
    title: string;
    date: any; // using any for Firestore Timestamp compatibility or Date
    content: string;
    imageUrl?: string;
    locations?: { label: string; maps: string }[];
    type: 'news' | 'event';
}
