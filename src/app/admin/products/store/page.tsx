'use client'
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  ShoppingCart, 
  Package, 
  Plus, 
  Minus,
  Tags,
  X,
  Box
} from "lucide-react";
import { useProductStore } from "@/store/productsStore";
import { Product } from "@/types/types";
import { MainNav } from "@/components/admin/main-nav";
import { Search } from "@/components/admin/search";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/admin/user-nav";


interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  currStock: number;
  unitsPerBox: number;
  unitsSold: number;
  quantity: number;
  totalAmount: number;
}

function CartContent({ cart, removeFromCart, updateQuantity }: {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
}) {
  const [totalAmount, setTotalAmount] = useState(0);
  useMemo(() => {
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    setTotalAmount(total);
  }, [cart]);
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item._id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item._id, -item.unitsPerBox)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item._id, item.unitsPerBox)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="pt-4 space-y-4">
        <Separator />
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total:</span>
          <span className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</span>
        </div>
        <Button className="w-full" disabled={cart.length === 0}>
          Checkout
        </Button>
      </div>
    </div>
  );
}

function Store() {
  const {products,fetchProducts} = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(product => product.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item._id === product._id);
      if (existingItem) {
        return currentCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity+item.unitsPerBox ,totalAmount: item.totalAmount+parseFloat(item.price) }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: product.unitsPerBox, totalAmount: parseFloat(product.price) * product.unitsPerBox }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(currentCart => 
      currentCart.map(item => {
        if (item._id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
    <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    <div className="min-h-screen bg-background">
      {/* Mobile Cart Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md flex flex-col p-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 mt-6">
              <CartContent 
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mx-auto max-w-7xl p-4 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Categories and Products Section */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Categories</h2>
            </div>
            
            <ScrollArea className="w-full rounded-md border">
              <div className="flex space-x-2 p-4">
                <Badge 
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer shrink-0"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </Badge>
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer shrink-0"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product._id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Badge variant="secondary">
                        <Box />{product.unitsPerBox}</Badge>
                    </div>
                    <p className="text-2xl font-bold">₹{product.price}</p>
                    <Button 
                      className="w-full"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop Cart Section */}
          <Card className="hidden md:block w-80 p-6 space-y-4 sticky top-8">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              {cartItemCount > 0 && (
                <Badge variant="secondary">{cartItemCount} items</Badge>
              )}
            </div>
            
            <CartContent 
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}

export default Store;