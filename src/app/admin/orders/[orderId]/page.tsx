interface OrderPageProps {
  params: { orderId: string };
}

export default function OrderDetails({ params }: OrderPageProps) {
  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {params.orderId}</p>
    </div>
  );
}
