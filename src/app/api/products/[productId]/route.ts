import { ProductsResponseId, getProductsId } from '@/lib/handlers';
import { NextRequest, NextResponse } from 'next/server';
import {Types} from 'mongoose';


export async function GET(
  //Definimos el/los parametros que debe coger la funcion
  request: NextRequest,
  {
    params,
  }:{
    params:{ productId:string };
  }
): Promise<NextResponse<ProductsResponseId> | {}> {
  //Comprobamos si el parametro es valido
    if(!Types.ObjectId.isValid(params.productId)){
        return NextResponse.json({},{status:400});
    }

  //Recogemos el resultado de la funcion del Handler
  const productId = await getProductsId(params.productId);

  //Comprobamos que la respuesta no sea nula
  if(productId === null){
    return NextResponse.json({},{status:404});
  }

  //Devolvemos la respuesta en formaton json
  return NextResponse.json(productId);
}