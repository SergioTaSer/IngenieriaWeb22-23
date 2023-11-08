import { NextRequest, NextResponse } from 'next/server';
import { createUser, CreateUserResponse } from '@/lib/handlers';

export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateUserResponse> | {}> {
  //Recogemos el cuerpo de la peticion
  const body = await request.json();

  //Comprobamos que esten todos los parametros del cuerpo
  if (!body.email || !body.password || !body.name || !body.surname || !body.address || !body.birthdate) {
    return NextResponse.json({}, { status: 400 });
  }

  //Recogemos el resultado del metodo del Handler
  const userId = await createUser(body);

  //Comprobamos que no sea nulo el resultado del Handler
  if (userId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  //Creamos un objeto headers para almacenar el encabezado de la respuesta HTTP
  const headers = new Headers();
  //Añadimos al encabezado la ubicacion a la que debe redirigirse
  headers.append('Location', `/api/users/${userId._id}`);
  //Enviamos la respuesta HTTP
  return NextResponse.json({ _id: userId._id }, { status: 201, headers: headers });
}