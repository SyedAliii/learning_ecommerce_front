import { apiClient } from './client';
import { Category, Product } from '@/types';

export const productsApi = {
  getAll: async () => {
    const response = await apiClient.get<Product[]>('/v1/get_all_products');
    const products: Product[] = response.data["products"];
    return products;
  },

  getSingle: async (categorySlug: string, subCategorySlug: string, title: string, productId: string) => {
    const response = await apiClient.get<Product>(`/v1/get_single_product/${categorySlug}/${subCategorySlug}/${title}/${productId}`);
    const product: Product = response.data["product"];
    return product;
  },

  search: async (query: string) => {
    const response = await apiClient.get<Product[]>('/v1/search', {
      params: { query },
    });
    return response.data["products"];
  },

  addCategory: async (category: string, subcategories: string[]) => {
    const response = await apiClient.post('/v1/add_new_category', {
      category,
      subcategories
    });
    return response.data;
  },

  renameCategory: async (category: string, newName: string[]) => {
    const response = await apiClient.post('/v1/rename_category', {
      category,
      newName
    });
    return response.data;
  },

  renameSubcategory: async (subcategory: string, newName: string) => {
    const response = await apiClient.post('/v1/rename_subcategory', {
      subcategory,
      newName
    });
    return response.data;
  },

  deleteCategory: async (category: string) => {
    const response = await apiClient.post('/v1/delete_category', {
      category
    });
    return response.data;
  },

  editCategory: async (category: string, subcategories: string[]) => {
    const response = await apiClient.post('/v1/edit_category', {
      category,
      subcategories
    });
    return response.data;
  },

  getAllCategoriesSubcategories: async () => {
    const response = await apiClient.get('/v1/get_all_categories_subcategories');
    const data = response.data["categories_subcategories"];

    const categories = Object.entries(data).map(([categoryId, subcategoryIds]) => ({
      id: categoryId,
      subcategories: (subcategoryIds as string[]).map((subId) => ({ id: subId })),
    }));

    return categories as Category[];
  },

  addProduct: async (title: string, description: string, price: number, stock: number,
    category: string, sub_category: string, image_files: File[]) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("quantity", stock.toString());
    formData.append("category_id", category);
    formData.append("subcategory_id", sub_category);

    Array.from(image_files || []).forEach((file) => {
      formData.append("images", file);
    });

    const headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };

    const response = await apiClient.post('/v1/add_product', formData, { headers });
    console.log("API Response:", response.data);
    return response.data["product"];
  },

  updateProduct: async (productId: string, updates: {
    title?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    sub_category?: string;
    image_files?: File[];
  }) => {
    const body: any = { "id": productId };

    if (updates.title) body.title = updates.title;
    if (updates.description) body.description = updates.description;
    if (updates.price !== undefined) body.price = updates.price;
    if (updates.stock !== undefined) body.quantity = updates.stock;
    if (updates.category) body.category_id = updates.category;
    if (updates.sub_category) body.subcategory_id = updates.sub_category;

    if (updates.image_files) {
      body.images = updates.image_files;
    }

    const headers = {
      Accept: "application/json",
    };

    const response = await apiClient.put(`/v1/update_product`, body, { headers });
    console.log("API Response:", response.data);
    return response.data["product"];
  },

  deleteProduct: async (productId: string) => {
    const response = await apiClient.delete(`/v1/delete_product/${productId}`);
    return response.data["message"];
  }
};
