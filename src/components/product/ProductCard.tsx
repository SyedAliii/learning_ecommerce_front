import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_id: product.id,
      quantity: 1,
      price: product.price,
      title: product.title,
      image: product.image_urls[0] || '',
    });
    toast.success('Added to cart!');
  };

  const productUrl = `/${product.category_slug || product.category}/${product.sub_category_slug || product.sub_category}/${product.slug || product.title}/${product.id}`;

  return (
    <Link to={productUrl} className="group block">
      <div className="relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover-lift">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_urls[0] || '/placeholder.svg'}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
        {product.stock > 0 && product.stock < 5 && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Only {product.stock} left
          </Badge>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {product.category} › {product.sub_category}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <Button
              size="icon"
              variant="default"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="rounded-full"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
