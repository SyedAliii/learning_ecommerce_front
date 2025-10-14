import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, Users } from 'lucide-react';
import { UserRole } from '@/types';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.Admin) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, user, navigate]);

  const stats = [
    {
      title: 'Total Products',
      value: '156',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Total Orders',
      value: '89',
      icon: ShoppingBag,
      color: 'text-green-600',
    },
    {
      title: 'Revenue',
      value: '$12,450',
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Customers',
      value: '234',
      icon: Users,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 bg-background">
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button onClick={() => navigate('/admin/products/new')}>
              Add New Product
            </Button>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="rounded-xl border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/admin/products/new')}>
                Add Product
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/orders')}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/categories')}>
                Manage Categories
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New order received</p>
                  <p className="text-sm text-muted-foreground">Order #12345 - $125.99</p>
                </div>
                <span className="text-sm text-muted-foreground">2h ago</span>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Product added</p>
                  <p className="text-sm text-muted-foreground">New product listing created</p>
                </div>
                <span className="text-sm text-muted-foreground">5h ago</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
