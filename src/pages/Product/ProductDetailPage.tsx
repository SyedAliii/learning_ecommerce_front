import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { productsApi } from '@/api/products.api';
import { usersApi } from '@/api/users.api';
import { cartApi } from '@/api/cart.api'; 
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useProductDirectWebSocket } from '@/hooks/use-product-websocket';
import { ShoppingCart, Share2, Heart } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { categorySlug, subCategorySlug, title, productId } = useParams<{ categorySlug: string; subCategorySlug: string; title: string; productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [product, setProduct] = useState(null);

  // Use the custom hook for WebSocket connection
  const { wsState } = useProductDirectWebSocket({
    productId,
    onProductUpdate: (updatedProduct) => {
      setProduct(updatedProduct);
    },
    enabled: !!productId
  });

  const { data: productRes, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await productsApi.getSingle(categorySlug!, subCategorySlug!, title!, productId!);
      setProduct(response);
      return response;
    },
    enabled: !!productId,
  });
  const addToCartMutation = useMutation({
    mutationKey: ['product', productId],
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return await cartApi.addToCart(productId, quantity);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to sync with cart');
    },
  });
  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      total_quantity: product.quantity,
      category_id: product.category_id,
      subcategory_id: product.subcategory_id,
      quantity_in_cart: quantity,
      image_url: product.product_img_urls?.[0] || '',
    });

    if (isAuthenticated) {
      addToCartMutation.mutate({ productId: product.id, quantity });
      toast.success('Added to Server Cart!');
    } else {
      toast.success('Added to cart!');
    }
  };
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square rounded-xl bg-muted animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded"></div>
              <div className="h-20 bg-muted animate-pulse rounded"></div>
              <div className="h-10 bg-muted animate-pulse rounded w-1/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden border bg-muted">
              <img
                src={product.product_img_urls[selectedImage] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {
            product.product_img_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.product_img_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <span>{product.category_id}</span>
                <span>›</span>
                <span>{product.subcategory_id}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
              {product.quantity > 0 ? (
                <Badge variant="secondary">In Stock ({product.quantity} available)</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={(behavior, current_qty) => {
                      setQuantity(current_qty);
                    }}
                  max={product.quantity}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={product.quantity === 0}
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1" onClick={handleShare}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
                {/* <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
