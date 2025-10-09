import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileOrders } from '@/components/profile/ProfileOrders';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { User, ShoppingBag } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <User className="h-4 w-4" />
              Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <ProfileOrders />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
