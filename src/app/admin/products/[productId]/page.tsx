
interface ProductPageProps {
    params: { productId: string };
  }
  
  export default function OrderDetails({ params }: ProductPageProps) {
    return (
      <div>
        <h1>Product Details</h1>
        <p>Product ID: {params.productId}</p>
      </div>
    );
  }
  