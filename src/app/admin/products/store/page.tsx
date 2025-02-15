'use client'
import { useState } from "react";
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
  X
} from "lucide-react";

// Mock data with more categories
const products = [
  { id: 1, name: "Gaming Laptop", price: 1299, category: "Electronics", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500" },
  { id: 2, name: "Mechanical Keyboard", price: 129, category: "Electronics", image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500" },
  { id: 3, name: "Cotton T-Shirt", price: 29, category: "Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
  { id: 4, name: "Denim Jeans", price: 79, category: "Clothing", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500" },
  { id: 5, name: "Coffee Maker", price: 89, category: "Kitchen", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500" },
  { id: 6, name: "Smart Watch", price: 299, category: "Electronics", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500" },
  { id: 7, name: "Running Shoes", price: 119, category: "Sports", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { id: 8, name: "Yoga Mat", price: 49, category: "Sports", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500" },
  { id: 9, name: "Desk Lamp", price: 39, category: "Home Office", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500" },
  { id: 10, name: "Wireless Mouse", price: 59, category: "Electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500" },
  { id: 11, name: "Blender", price: 79, category: "Kitchen", image: "https://images.unsplash.com/photo-1619847909339-1d2bf32a8fdd?w=500" },
  { id: 12, name: "Office Chair", price: 199, category: "Home Office", image: "https://images.unsplash.com/photo-1589384267710-7a25bc24e2d6?w=500" },
];

const categories = [...new Set(products.map(product => product.category))];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function CartContent({ cart, removeFromCart, updateQuantity, totalAmount }: {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  totalAmount: number;
}) {
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
              <div key={item.id} className="space-y-2">
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
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, 1)}
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
          <span className="text-2xl font-bold">₹{totalAmount}</span>
        </div>
        <Button className="w-full" disabled={cart.length === 0}>
          Checkout
        </Button>
      </div>
    </div>
  );
}

function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const addToCart = (product: typeof products[0]) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(currentCart => 
      currentCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
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
                totalAmount={totalAmount}
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
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Badge variant="secondary">{product.category}</Badge>
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
              totalAmount={totalAmount}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Store;