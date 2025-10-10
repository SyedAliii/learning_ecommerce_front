import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation } from '@tanstack/react-query';
import { cartApi } from '@/api/cart.api';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      toast.info('Please login to continue');
      return;
    }
    navigate('/checkout');
  };

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return await cartApi.addToCart(productId, quantity);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Add To Cart: Failed to sync with server cart');
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return await cartApi.removeFromCart(productId, quantity);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Remove From Cart: Failed to sync with server cart');
    },
  });

  const deleteCartMutation = useMutation({
    mutationFn: async () => {
      return await cartApi.clearCart();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete cart on server');
    },
  });

  const handleAddToCart = (product_id, changeQuantity, current_qty) => {
    if (isAuthenticated) {
      updateQuantity(product_id, current_qty);
      addToCartMutation.mutate({ productId: product_id, quantity: changeQuantity });
      toast.success('Added to Server Cart!');
    } else {
      updateQuantity(product_id, current_qty);
      toast.success('Added to cart!');
    }
  };

  const handleRemoveFromCart = (product_id, changeQuantity, current_qty) => {
    if (isAuthenticated) {
      removeFromCartMutation.mutate({ productId: product_id, quantity: changeQuantity });
      if (current_qty === 0) {
        removeItem(product_id);
      } else {
        updateQuantity(product_id, current_qty);
      }
      toast.success('Removed from Server Cart!');
    } else {
      if (current_qty === 0) {
        removeItem(product_id);
      } else {
        updateQuantity(product_id, current_qty);
      }
      toast.success('Removed from cart!');
    }
  };

  const handleDeleteCart = () => {
    if (isAuthenticated) {
      deleteCartMutation.mutate();
      clearCart();
      toast.success('Deleted Server Cart!');
    } else {
      clearCart();
      toast.success('Deleted cart!');
    }
  };

  const subtotal = getTotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart
            </p>
            <Button onClick={() => navigate('/')}>Continue Shopping</Button>
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
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={handleDeleteCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.image_url || '/placeholder.svg'}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate mb-2">{item.title}</h3>
                  <p className="text-lg font-bold mb-3">${item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between">
                    <QuantitySelector
                      quantity={item.quantity_in_cart}
                      onQuantityChange={(behavior, current_qty) => {
                        if (behavior) {
                          handleAddToCart(item.id, 1, current_qty);
                        } else {
                          handleRemoveFromCart(item.id, 1, current_qty);
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromCart(item.id, 0, 0)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border bg-card p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
