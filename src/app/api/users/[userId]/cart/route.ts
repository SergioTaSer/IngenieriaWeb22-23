import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getCartUser, CartUserResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<CartUserResponse> | {}> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const cart = await getCartUser(params.userId);

  if (cart === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(cart);
}