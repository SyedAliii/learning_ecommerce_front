import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsApi } from '@/api/products.api';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  category: z.string().min(1, 'Category is required'),
  sub_category: z.string().min(1, 'Subcategory is required'),
  image_urls: z.string().min(1, 'At least one image URL is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

const AdminProductFormPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isEdit = !!productId;

  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getSingle(productId!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      sub_category: product.sub_category,
      image_urls: product.image_urls.join(', '),
    } : undefined,
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      // TODO: Implement create product API
      console.log('Creating product:', data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      navigate(ROUTES.ADMIN_PRODUCTS);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: any) => {
      // TODO: Implement update product API
      console.log('Updating product:', data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      navigate(ROUTES.ADMIN_PRODUCTS);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const productData = {
      ...data,
      image_urls: data.image_urls.split(',').map(url => url.trim()),
    };

    if (isEdit) {
      updateProductMutation.mutate({ ...productData, id: productId });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <AdminSidebar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={4} {...register('description')} />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        step="0.01"
                        {...register('price', { valueAsNumber: true })} 
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input 
                        id="stock" 
                        type="number"
                        {...register('stock', { valueAsNumber: true })} 
                      />
                      {errors.stock && (
                        <p className="text-sm text-destructive">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" {...register('category')} />
                      {errors.category && (
                        <p className="text-sm text-destructive">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sub_category">Subcategory</Label>
                      <Input id="sub_category" {...register('sub_category')} />
                      {errors.sub_category && (
                        <p className="text-sm text-destructive">{errors.sub_category.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_urls">Image URLs (comma-separated)</Label>
                    <Textarea 
                      id="image_urls" 
                      rows={3}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      {...register('image_urls')} 
                    />
                    {errors.image_urls && (
                      <p className="text-sm text-destructive">{errors.image_urls.message}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">
                      {isEdit ? 'Update Product' : 'Create Product'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProductFormPage;
