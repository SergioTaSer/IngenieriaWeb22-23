//LOGICA DE LOS ENDPOINTS DE LAS REST APIs

import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import { ObjectId, Types } from 'mongoose';



/*GET /api/products*/
export interface ProductsResponse {
  products: Product[];
}

export async function getProducts(): Promise<ProductsResponse> {
  await connect();

  const productProjection = {
    name: true,
    price: true,
    img: true,
  };

  const products = await Products.find({}, productProjection);
  
  return {
    products: products,
  };
}



/*GET /api/products/[productId]*/
export interface ProductsResponseId {
  products: Product[];
}

//Pasamos el parametro necesario
export async function getProductsId(productId:string): Promise<ProductsResponseId | null> {
  //Conectamos con la bbdd
  await connect();

  //Creamos proyección de la salida
  const productProjectionId = {
    name: true,
    price: true,
    img: true,
    synopsis: true,
  };

  //Buscamos los elementos que necesitamos
  const productsId = await Products.findById(productId, productProjectionId);
  
  //Devolvemos en formato JSON
  return {
    products: productsId,
  };
}



/* POST /api/users */
export interface CreateUserResponse {
    _id: Types.ObjectId | string;
  }
  
  //Definimos atributos de la creacion
  export async function createUser(user: {
    email: string;
    password: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
  }): Promise<CreateUserResponse | null> {
    //Conectamos con la bbdd
    await connect();
  
    //Comprobamos que no exista ese email
    const prevUser = await Users.find({ email: user.email });
    if (prevUser.length !== 0) {
      return null;
    }
    
    //Creamos el doc
    const doc: User = {
      ...user, //Cogemos los atributos de User
      //Añadimos/Modificamos Atributos
      birthdate: new Date(user.birthdate),
      cartItems: [],
      orders: [],
    };
  
    //Crreamos el usuario
    const newUser = await Users.create(doc);
    
    //Devolvemos el Id del nuevo usuario creado
    return {
      _id: newUser._id,
    };
  }


/* GET /api/users[userId]  */
export interface UserResponse {
    users: User[];
    // email: string;
    // name: string;
    // surname: string;
    // address: string;
    // birthdate: Date;
}
  
  export async function getUser(userId: string): Promise<UserResponse | null> {
    await connect();
  
    const userProjection = {
      email: true,
      name: true,
      surname: true,
      address: true,
      birthdate: true,
    };
    
    const user = await Users.findById(userId, userProjection);
  
    //Devolvemos nulo si no encontramos un usuario con es ID
    if (user === null) {
      return null;
    }
  
    return user;
  }