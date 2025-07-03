import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navItems = [
    { id: 'products', label: '상품 탐색', icon: '🛍️' },
    { id: 'wishlist', label: '찜 목록', icon: '💖' },
    { id: 'analytics', label: '소비 분석', icon: '📊' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ id, label, icon }) => (
          <Button
            key={id}
            variant={currentPage === id ? "default" : "ghost"}
            onClick={() => setCurrentPage(id)}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <span className="text-lg">{icon}</span>
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}