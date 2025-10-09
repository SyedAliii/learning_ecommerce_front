import { useState } from 'react';
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

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');

  // TODO: Replace with actual API calls
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          subcategories: [
            { id: '1-1', name: 'Phones', slug: 'phones', category_id: '1' },
            { id: '1-2', name: 'Laptops', slug: 'laptops', category_id: '1' },
          ],
        },
        {
          id: '2',
          name: 'Clothing',
          slug: 'clothing',
          subcategories: [
            { id: '2-1', name: 'Men', slug: 'men', category_id: '2' },
            { id: '2-2', name: 'Women', slug: 'women', category_id: '2' },
          ],
        },
      ];
    }, 
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      // TODO: Implement API call
      console.log('Creating category:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      setIsDialogOpen(false);
      setCategoryName('');
      setCategorySlug('');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      // TODO: Implement API call
      console.log('Deleting category:', categoryId);
      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate({
      name: categoryName,
      slug: categorySlug,
    });
  };

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
                <Button>
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
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
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
                      <CardTitle>{category.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category);
                            setCategoryName(category.name);
                            setCategorySlug(category.slug);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Slug: <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Subcategories:</span>
                        {category.subcategories.map((sub) => (
                          <Badge key={sub.id} variant="secondary">
                            {sub.name}
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
