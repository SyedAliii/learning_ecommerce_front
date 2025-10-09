import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { orderApi } from '@/api/order.api';
import { Package } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const ProfileOrders = () => {
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: orderApi.getUserOrders,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
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
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Button onClick={() => navigate(ROUTES.HOME)}>Start Shopping</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover-lift cursor-pointer" onClick={() => navigate(ROUTES.ORDER_CONFIRMATION.replace(':orderId', order.id))}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <Badge>{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <span key={index} className="text-sm text-muted-foreground">
                    {item.title}
                    {index < Math.min(2, order.items.length - 1) && ','}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-muted-foreground">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
