import { Product, SpendingRecord } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: '무선 블루투스 헤드폰',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    price: 89000,
    rating: 4.5,
    category: '전자기기'
  },
  {
    id: '2',
    title: '아메리카노 원두 1kg',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    price: 25000,
    rating: 4.8,
    category: '식품'
  },
  {
    id: '3',
    title: '캐시미어 니트 스웨터',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    price: 120000,
    rating: 4.3,
    category: '의류'
  },
  {
    id: '4',
    title: '스마트워치',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    price: 350000,
    rating: 4.6,
    category: '전자기기'
  },
  {
    id: '5',
    title: '요가 매트',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    price: 45000,
    rating: 4.4,
    category: '운동용품'
  },
  {
    id: '6',
    title: '향수',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    price: 85000,
    rating: 4.2,
    category: '뷰티'
  },
  {
    id: '7',
    title: '책상 스탠드',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    price: 65000,
    rating: 4.7,
    category: '가구'
  },
  {
    id: '8',
    title: '텀블러',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    price: 32000,
    rating: 4.5,
    category: '생활용품'
  }
];

export const mockSpendingHistory: SpendingRecord[] = [
  {
    id: '1',
    productId: '1',
    productTitle: '무선 마우스',
    amount: 45000,
    emotionTag: 'need',
    date: new Date(2025, 6, 1)
  },
  {
    id: '2',
    productId: '2', 
    productTitle: '과자 세트',
    amount: 15000,
    emotionTag: 'stress',
    date: new Date(2025, 6, 5)
  },
  {
    id: '3',
    productId: '3',
    productTitle: '새 가방',
    amount: 180000,
    emotionTag: 'desire',
    date: new Date(2025, 6, 10)
  },
  {
    id: '4',
    productId: '4',
    productTitle: '운동화',
    amount: 120000,
    emotionTag: 'need',
    date: new Date(2025, 6, 15)
  },
  {
    id: '5',
    productId: '5',
    productTitle: '립밤',
    amount: 8000,
    emotionTag: 'stress',
    date: new Date(2025, 6, 20)
  },
  {
    id: '6',
    productId: '6',
    productTitle: '핸드크림',
    amount: 25000,
    emotionTag: 'desire',
    date: new Date(2025, 6, 25)
  }
];

export const emotionLabels = {
  need: { emoji: '🧠', label: '필요', color: 'text-green-600 bg-green-50' },
  desire: { emoji: '🤍', label: '욕망', color: 'text-pink-600 bg-pink-50' },
  stress: { emoji: '⚠️', label: '스트레스', color: 'text-red-600 bg-red-50' }
};