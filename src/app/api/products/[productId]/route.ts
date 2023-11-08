import { ProductsResponseId, getProductsId } from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';
import {Types} from 'mongoose';


export async function GET(
  request: NextRequest,
  {
    params,
  }:{
    params:{ productId:string };
  }
): Promise<NextResponse<ProductsResponseId> | {}> {
    if(!Types.ObjectId.isValid(params.productId)){
        return NextResponse.json({},{status:400});
    }

  const productId = await getProductsId(params.productId);

  if(productId === null){
    return NextResponse.json({},{status:404});
  }

  return NextResponse.json(productId);
}