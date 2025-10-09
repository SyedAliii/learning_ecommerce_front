import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { Search } from 'lucide-react';
import { useState } from 'react';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Replace with actual API call
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: 'ORD-001',
          user: { full_name: 'John Doe', email: 'john@example.com' },
          items: [{ title: 'Product 1', quantity: 2, price: 29.99 }],
          total: 59.98,
          status: 'Pending',
          created_at: new Date().toISOString(),
        },
        {
          id: 'ORD-002',
          user: { full_name: 'Jane Smith', email: 'jane@example.com' },
          items: [{ title: 'Product 2', quantity: 1, price: 49.99 }],
          total: 49.99,
          status: 'Shipped',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    },
  });

  const filteredOrders = orders?.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <AdminSidebar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

          <Card className="mb-6">
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
          </Card>

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
              {filteredOrders?.map((order) => (
                <Card key={order.id} className="hover-lift cursor-pointer" onClick={() => navigate(ROUTES.ADMIN_ORDER_DETAIL.replace(':orderId', order.id))}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
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
                        <p className="text-sm text-muted-foreground">{order.user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{order.user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Items</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Total</p>
                        <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                      </div>
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
