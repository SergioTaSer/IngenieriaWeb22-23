import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { updateAddCartItem, ProductCartResponse } from '@/lib/handlers';
import { deleteCartItem, DeleteProductResponse } from '@/lib/handlers';



export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string, productId: string };
  }
): Promise<NextResponse<ProductCartResponse> | {} | null> {

  //Recogemos el cuerpo de la peticion
  const body = await request.json();

  if (!Types.ObjectId.isValid(params.userId)
        ||
      !Types.ObjectId.isValid(params.productId)
        ||
      !body.qty
        ||
       body.qty <= 0
     ) {
    return NextResponse.json({}, { status: 400 });
    }


  const cartItem = await updateAddCartItem(
    params.userId,
    params.productId,
    body.qty,
  );

  if (!cartItem || !cartItem.cartItems) {
    return NextResponse.json({}, { status: 404 });
  }

  if(cartItem.created){
    return NextResponse.json(cartItem.cartItems, {status:201});
  } else{
    return NextResponse.json(cartItem.cartItems, {status:200});
  }
}


export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string, productId: string};
  }
): Promise<NextResponse<DeleteProductResponse> | {} | null> {
  if (!Types.ObjectId.isValid(params.userId)
        ||
      !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json({}, { status: 400 });
  }

  const cart = await deleteCartItem(params.userId, params.productId);

  if (cart === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(cart);
}