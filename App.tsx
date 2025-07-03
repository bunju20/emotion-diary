import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ProductExplorer } from './components/ProductExplorer';
import { WishCart } from './components/WishCart';
import { SpendingDashboard } from './components/SpendingDashboard';
import { SettingsPage } from './components/SettingsPage';
import { PurchaseInterceptDialog } from './components/PurchaseInterceptDialog';
import { WishItem, SpendingRecord, Settings, Product } from './types';
import { mockProducts, mockSpendingHistory } from './data/mockData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('products');
  const [wishList, setWishList] = useState<WishItem[]>([]);
  const [spendingHistory, setSpendingHistory] = useState<SpendingRecord[]>(mockSpendingHistory);
  const [settings, setSettings] = useState<Settings>({
    monthlyBudget: 500000,
    stressWarningThreshold: 3,
    purchaseDelayMinutes: 5
  });

  // 구매 차단 팝업 상태
  const [purchaseDialog, setPurchaseDialog] = useState<{
    open: boolean;
    product: Product | null;
    delayMinutes: number;
  }>({
    open: false,
    product: null,
    delayMinutes: 0
  });

  const addToWishList = (product: Product, emotionTag: 'need' | 'desire' | 'stress', memo?: string) => {
    const wishItem: WishItem = {
      ...product,
      addedAt: new Date(),
      memo,
      emotionTag
    };
    setWishList(prev => [...prev, wishItem]);
  };

  const removeFromWishList = (productId: string) => {
    setWishList(prev => prev.filter(item => item.id !== productId));
  };

  const handlePurchaseAttempt = (product: Product) => {
    // 구매 시도 시 딜레이 타이머와 함께 팝업 표시
    setPurchaseDialog({
      open: true,
      product,
      delayMinutes: settings.purchaseDelayMinutes
    });
  };

  const handlePurchaseConfirm = (product: Product, emotionTag: 'need' | 'desire' | 'stress') => {
    // 실제 구매 처리
    const purchaseRecord: SpendingRecord = {
      id: Date.now().toString(),
      productId: product.id,
      productTitle: product.title,
      amount: product.price,
      emotionTag,
      date: new Date()
    };
    
    setSpendingHistory(prev => [...prev, purchaseRecord]);
    
    // 찜 목록에서 제거
    removeFromWishList(product.id);
    
    // 팝업 닫기
    setPurchaseDialog({
      open: false,
      product: null,
      delayMinutes: 0
    });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'products':
        return (
          <ProductExplorer
            products={mockProducts}
            onAddToWishList={addToWishList}
            onPurchaseAttempt={handlePurchaseAttempt}
            wishList={wishList}
          />
        );
      case 'wishlist':
        return (
          <WishCart
            wishList={wishList}
            onRemoveFromWishList={removeFromWishList}
            onPurchaseAttempt={handlePurchaseAttempt}
          />
        );
      case 'analytics':
        return (
          <SpendingDashboard
            spendingHistory={spendingHistory}
            settings={settings}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            onSettingsChange={setSettings}
          />
        );
      default:
        return (
          <ProductExplorer
            products={mockProducts}
            onAddToWishList={addToWishList}
            onPurchaseAttempt={handlePurchaseAttempt}
            wishList={wishList}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 메인 컨텐츠 */}
      <main className="pb-20">
        {renderCurrentPage()}
      </main>

      {/* 하단 네비게이션 */}
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />

      {/* 구매 차단 팝업 */}
      <PurchaseInterceptDialog
        isOpen={purchaseDialog.open}
        product={purchaseDialog.product}
        delayMinutes={purchaseDialog.delayMinutes}
        onClose={() => setPurchaseDialog({ open: false, product: null, delayMinutes: 0 })}
        onConfirmPurchase={handlePurchaseConfirm}
      />
    </div>
  );
}