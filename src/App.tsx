import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import SearchResultsPage from "./pages/Product/SearchResultsPage";
import CartPage from "./pages/Cart/CartPage";
import CheckoutPage from "./pages/Cart/CheckoutPage";
import OrderConfirmationPage from "./pages/Order/OrderConfirmationPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductsListPage from "./pages/Admin/AdminProductsListPage";
import AdminProductFormPage from "./pages/Admin/AdminProductFormPage";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage";
import AdminOrdersPage from "./pages/Admin/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/Admin/AdminOrderDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/:categorySlug/:subCategorySlug/:title/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId/confirmation" element={<OrderConfirmationPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsListPage />} />
          <Route path="/admin/products/new" element={<AdminProductFormPage />} />
          <Route path="/admin/products/:productId/edit" element={<AdminProductFormPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:orderId" element={<AdminOrderDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
