import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
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
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsApi } from '@/api/products.api';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { Product, UserRole } from '@/types';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  category: z.string().min(1, 'Category is required'),
  sub_category: z.string().min(1, 'Subcategory is required'),
  image_files: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      'At least one image file is required'
    ),
});

const productSchemaWithoutImageFiles = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  category: z.string().min(1, 'Category is required'),
  sub_category: z.string().min(1, 'Subcategory is required'),
});


type ProductFormData = z.infer<typeof productSchema>;

const AdminProductFormPage = () => {
  const location = useLocation();
  const state = location.state as { product: Product };
  const product = state.product;
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isEdit = !!productId;

  const { watch } = useForm();
  
  const [isMutating, setIsMutating] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await productsApi.getAllCategoriesSubcategories();
    },
  });

  useEffect(() => {
    if (isMutating) {
      document.body.style.pointerEvents = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.opacity = '0.6';
    } else {
      document.body.style.pointerEvents = '';
      document.body.style.userSelect = '';
      document.body.style.opacity = '';
    }

    return () => {
      document.body.style.pointerEvents = '';
      document.body.style.userSelect = '';
      document.body.style.opacity = '';
    };
  }, [isMutating]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(isEdit ? productSchemaWithoutImageFiles : productSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.quantity,
      category: product.category_id,
      sub_category: product.subcategory_id,
      image_files: product.product_img_urls.join(', '),
    } : undefined,
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: ProductFormData) => {
      return await productsApi.addProduct(product.title, product.description, product.price, product.stock,
        product.category, product.sub_category, product.image_files);
    },
    onMutate: () => {
      setIsMutating(true);
    },
    onSuccess: () => {
      setIsMutating(false);
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    },
    onError: (error) => {
      setIsMutating(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred while creating the product',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      navigate(ROUTES.ADMIN_PRODUCTS);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, productFormData }: { productId: string, productFormData: ProductFormData }) => {
      const updates = {};
      if (productFormData.title !== product.title) {
        updates['title'] = productFormData.title;
      }
      if (productFormData.description !== product.description) {
        updates['description'] = productFormData.description;
      }
      if (productFormData.price !== product.price) {
        updates['price'] = productFormData.price;
      }
      if (productFormData.stock !== product.quantity) {
        updates['stock'] = productFormData.stock;
      }
      if (productFormData.category !== product.category_id) {
        updates['category'] = productFormData.category;
      }
      if (productFormData.sub_category !== product.subcategory_id) {
        updates['sub_category'] = productFormData.sub_category;
      }
      if (productFormData.image_files) {
        updates['image_files'] = Array.from(productFormData.image_files as FileList);
      }

      return await productsApi.updateProduct(productId, updates);
    },
    onMutate: () => {
      setIsMutating(true);
    },
    onSuccess: () => {
      setIsMutating(false);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    },
    onError: (error) => {
      setIsMutating(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred while updating the product',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      navigate(ROUTES.ADMIN_PRODUCTS);
    },
  });

  const onSubmit = (productFormData: ProductFormData) => {
    if (isEdit) {
      updateProductMutation.mutate({ productId: productId, productFormData: productFormData });
    } else {
      createProductMutation.mutate(productFormData);
    }
  };

  const selectedCategory = watch("category");

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
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                      <select
                        id="category"
                        {...register('category')}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a category</option>
                        {categories &&
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.id}
                            </option>
                          ))}
                      </select>
                      {errors.category && (
                        <p className="text-sm text-destructive">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sub_category">Subcategory</Label>
                      <select
                        id="sub_category"
                        {...register('sub_category')}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a subcategory</option>
                        {categories &&
                          categories.map((category) =>
                            category.subcategories.map((subcategory) => (
                              <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.id}
                              </option>
                            ))
                          )}
                      </select>
                      {errors.sub_category && (
                        <p className="text-sm text-destructive">{errors.sub_category.message}</p>
                      )}
                    </div>
                  </div>

                  {!isEdit && (
                    <div className="mb-3 w-96">
                      <label
                        htmlFor="formFileMultiple"
                        className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                      >
                        Please Add At Least One Image
                      </label>
                      <input
                        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                        id="formFileMultiple"
                        multiple
                        {...register('image_files', { required: true })}
                      />
                      {errors.image_files && (
                        <p className="text-sm text-destructive">{String(errors.image_files.message)}</p>
                      )}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button type="submit">
                      {isEdit ? 'Update Product' : 'Create Product'}
                    </Button>
                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
                    >
                      Cancel
                    </Button> */}
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
