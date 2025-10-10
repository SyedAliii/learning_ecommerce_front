import { apiClient } from './client';
import { Product } from '@/types';

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
    return response.data;
  },
};
