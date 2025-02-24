import { CartItem } from "@/app/admin/products/store/page"

export const createOrderByAdmins= async(cart :CartItem[],orderDetails:{
    customerId:string,
    orderDate:string,
    totalAmount:string
})=>{
    const orderItems=cart.map((item:CartItem)=>{
      return {
        productId:item._id,
        productName:item.name,
        hsn:item.hsn,
        quantity:item.quantity,
        priceAtTime:item.price,
        total:(item.quantity*parseInt(item.price)).toString()
      }
    })

    const order={
      customerId:orderDetails.customerId,
      orderDate:orderDetails.orderDate,
      totalAmount:orderDetails.totalAmount,
      items:orderItems,
    }

    const response=await fetch("/api/orders/new-order-by-admins",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(order)
    })
    if(response.ok){
      return "order Created Successfully"
    }
    else{
      return null
    }
}