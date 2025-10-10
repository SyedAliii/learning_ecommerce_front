import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products.api';
import { Edit, Trash2, Search } from 'lucide-react';

const AdminProductsListPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'shop_owner') {
      navigate('/auth/login');
    }
  }, [isAuthenticated, user, navigate]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: productsApi.getAll,
  });

  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 bg-background">
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <Button onClick={() => navigate('/admin/products/new')}>
              Add New Product
            </Button>
          </div>
        </header>

        <main className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Stock</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <img
                            src={product.image_urls[0] || '/placeholder.svg'}
                            alt={product.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{product.title}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {product.category_id} › {product.sub_category_id}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {product.quantity < 5 ? (
                            <Badge variant="destructive">{product.quantity}</Badge>
                          ) : (
                            <span>{product.quantity}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProductsListPage;
