import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { orderApi } from '@/api/order.api';
import { Order, UserRole } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  useEffect(() => {
      if (!isAuthenticated || user?.role !== UserRole.Admin) {
        navigate('/auth/login');
      }
  }, [isAuthenticated, user, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: orderApi.getAllOrders,
  });

  // const filteredOrders = orders?.filter(order =>
  //   order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   order.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Confirmed':
        return 'default';
      case 'Shipped':
        return 'outline';
      case 'Delivered':
        return 'default';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const shippedOrderMutation = useMutation({
    mutationFn: async ({ user_id, cart_id }: { user_id: number; cart_id: number }) => {
      return await orderApi.shippedOrder(user_id, cart_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: 'Success',
        description: 'Order marked as shipped',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data["Generic Exception"] || 'Failed to mark order as shipped',
      });
    },
  });

  const deliveredOrderMutation = useMutation({
    mutationFn: async ({ user_id, cart_id }: { user_id: number; cart_id: number }) => {
      return await orderApi.deliveredOrder(user_id, cart_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: 'Success',
        description: 'Order marked as delivered',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data["Generic Exception"] || 'Failed to mark order as delivered',
      });
    },
  });

  useEffect(() => {
    if (orders) {
      setOrdersList(orders);
    }
  }, [orders]);

  function handleShippedOrder(user_id: number, cart_id: number): void {
    shippedOrderMutation.mutate({ user_id, cart_id });
  }

  function handleDeliveredOrder(user_id: number, cart_id: number): void {
    deliveredOrderMutation.mutate({ user_id, cart_id });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1 flex">
        <AdminSidebar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

          {/* <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card> */}

          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {ordersList?.map((order) => (
                // <Card key={order.id} className="hover-lift cursor-pointer" onClick={() => navigate(ROUTES.ADMIN_ORDER_DETAIL.replace(':orderId', order.id))}>
                <Card key={order.id} className="hover-lift cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      </div>
                      <Badge variant={getStatusVariant(order.status) as any}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Customer</p>
                        <p className="text-sm text-muted-foreground">{order.username}</p>
                        <p className="text-xs text-muted-foreground">{order.user_email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Items</p>
                        <p className="text-sm text-muted-foreground">
                          {order.total_items} item{order.total_items > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Total</p>
                        <p className="text-lg font-semibold">${order.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShippedOrder(order.user_id, order.cart_id)}
                      >
                        Mark Shipped
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeliveredOrder(order.user_id, order.cart_id)}
                      >
                        Mark Delivered
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminOrdersPage;
