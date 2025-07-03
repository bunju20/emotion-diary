import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product, WishItem } from '../types';

interface ProductExplorerProps {
  products: Product[];
  wishList: WishItem[];
  onAddToWishList: (product: Product, emotionTag: 'need' | 'desire' | 'stress', memo?: string) => void;
  onPurchaseAttempt: (product: Product) => void;
}

export function ProductExplorer({ products, wishList, onAddToWishList, onPurchaseAttempt }: ProductExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isInWishlist = (productId: string) => {
    return wishList.some(item => item.id === productId);
  };

  const handleAddToWishlist = (product: Product) => {
    // 기본적으로 'desire' 태그로 추가
    onAddToWishList(product, 'desire');
  };

  return (
    <div className="pb-20 p-4">
      <div className="mb-6">
        <h1 className="mb-4">상품 탐색</h1>
        
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
          <Input
            placeholder="어떤 상품을 찾고 계신가요?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === '' ? "default" : "outline"}
            onClick={() => setSelectedCategory('')}
            className="whitespace-nowrap"
          >
            전체
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover"
              />
              <Button
                size="sm"
                variant={isInWishlist(product.id) ? "default" : "ghost"}
                onClick={() => handleAddToWishlist(product)}
                disabled={isInWishlist(product.id)}
                className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-white/80 backdrop-blur-sm"
              >
                {isInWishlist(product.id) ? '💚' : '🤍'}
              </Button>
            </div>
            
            <CardContent className="p-3">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span className="text-sm text-muted-foreground">{product.rating}</span>
              </div>
              
              <h3 className="line-clamp-2 mb-2">{product.title}</h3>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold">
                  {product.price.toLocaleString()}원
                </span>
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>

              <Button
                onClick={() => onPurchaseAttempt(product)}
                className="w-full"
                size="sm"
              >
                구매하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}