import Link from 'next/link';
import { ArrowRight, Package, ShoppingCart, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getProducts } from '@/lib/db';

export default async function DashboardPage() {
  // Get product statistics for the dashboard
  const { products, totalProducts } = await getProducts('', 0);

  // Calculate some basic statistics
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const averagePrice = products.length > 0
    ? products.reduce((sum, product) => sum + Number(product.price), 0) / products.length
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Product Summary Widget */}
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {activeProducts} active products
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/products" className="w-full">
            <Button variant="outline" className="w-full justify-between">
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Inventory Summary */}
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStock}</div>
          <p className="text-xs text-muted-foreground">
            Total items in stock
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground w-full">
            Average price: ${averagePrice.toFixed(2)}
          </p>
        </CardFooter>
      </Card>

      {/* Customers Widget Placeholder */}
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customers</CardTitle>
          <Users2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            No customer data available
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/customers" className="w-full">
            <Button variant="outline" className="w-full justify-between">
              View Customers
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
