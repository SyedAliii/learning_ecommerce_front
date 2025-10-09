import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderApi } from '@/api/order.api';
import { toast } from '@/hooks/use-toast';
import { Package, User, MapPin, CreditCard } from 'lucide-react';

const AdminOrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => orderApi.getSingleOrder(orderId!),
    enabled: !!orderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      // TODO: Implement update order status API
      console.log('Updating order status:', { orderId, newStatus });
      return newStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
      toast({
        title: 'Status updated',
        description: 'Order status has been updated successfully.',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <p>Order not found</p>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <AdminSidebar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                <p className="text-muted-foreground mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge>{order.status}</Badge>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateStatusMutation.mutate(value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Update the order status
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Customer</h3>
                        <p className="text-sm text-muted-foreground">{order.user.full_name}</p>
                        <p className="text-sm text-muted-foreground">{order.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Items</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Shipping</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.shipping.city}, {order.shipping.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Payment</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.payment_method.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">{order.shipping.name}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping.city}, {order.shipping.zip}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.shipping.country}</p>
                    <p className="text-sm text-muted-foreground">Phone: {order.shipping.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-6 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${order.shipping_fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminOrderDetailPage;
