import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit } from 'lucide-react';
import { productsApi } from '@/api/products.api';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.Admin) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, user, navigate]);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getAllCategoriesSubcategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async ({ categoryName, subcategories }: { categoryName: string, subcategories: string }) => {
      const subcategoriesArray = subcategories.split(',').map((sub) => sub.trim());
      return await productsApi.addCategory(categoryName, subcategoriesArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      setIsDialogOpen(false);
      setCategoryName('');
      setSubcategory('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data["Generic Exception"] || 'Failed to create category',
      });
    },
  });

  const editCategoryMutation = useMutation({
    mutationFn: async ({ categoryName, subcategories }: { categoryName: string, subcategories: string }) => {
      const subcategoriesArray = subcategories.split(',').map((sub) => sub.trim());
      return await productsApi.editCategory(categoryName, subcategoriesArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category edited successfully',
      });
      setIsDialogOpen(false);
      setCategoryName('');
      setSubcategory('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data["Generic Exception"] || 'Failed to edit category',
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      return await productsApi.deleteCategory(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data["Generic Exception"] || 'Failed to delete category',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      editCategoryMutation.mutate({
        categoryName: categoryName,
        subcategories: subcategory,
      });
    } else {
      setEditingCategory(null);
      createCategoryMutation.mutate({
        categoryName: categoryName,
        subcategories: subcategory,
      })
    };
  };

  const handleDelete = (category: string) => {
    deleteCategoryMutation.mutate(category);
  };

  useEffect(() => {
    if (categories) {
      setCategoriesList(categories);
    }
  }, [categories]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1 flex">
        <AdminSidebar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Categories</h1>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                            setEditingCategory(null);
                            setCategoryName('');
                            setSubcategory('');
                          }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">SubCategory (Enter multiple subcategories separated by commas)</Label>
                    <Input
                      id="subcategory"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">
                    {editingCategory ? 'Update' : 'Create'} Category
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
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
          ) : (
            <div className="grid gap-4">
              {categories?.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{category.id}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category);
                            setCategoryName(category.id);
                            setSubcategory(category.subcategories.map((sub) => sub.id).join(", "));
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Subcategories:</span>
                        {category.subcategories.map((sub) => (
                          <Badge key={sub.id} variant="secondary">
                            {sub.id}
                          </Badge>
                        ))}
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

export default AdminCategoriesPage;
