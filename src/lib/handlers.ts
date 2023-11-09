//LOGICA DE LOS ENDPOINTS DE LAS REST APIs

import connect from '@/lib/mongoose';
import Users, { User } from '@/models/User';
import Products, { Product } from '@/models/Product';
import Orders, { Order } from '@/models/Order';
import { Types } from 'mongoose';




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
  const products = await Products.findById(productId, productProjectionId);
  
  if (!products) {
    return null;
  }

  //Devolvemos en formato JSON
  return {
    products: products,
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
  
    //Creamos el usuario
    const newUser = await Users.create(doc);
    
    //Devolvemos el Id del nuevo usuario creado
    return {
      _id: newUser._id,
    };
  }


/* GET /api/users/[userId]  */
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



/* GET /api/users/[userId]/cart */
export interface CartItem {
  product : {
    name:string;
    price: string;
  }
  qty: number;
}

export interface CartUserResponse {
  cartItems: CartItem[];
}

export async function getCartUser(userId: string): Promise<CartUserResponse | null> {
  await connect();

  const cartUserProjection = {
    'cartItems.product': true,
    'cartItems.qty': true,
  };
  
  const productProjection = {
    name:true, 
    price: true,
  }
  
  const cart = await Users.findById(userId, cartUserProjection).populate("cartItems.product", productProjection);

  if (cart === null) {
    return null;
  }

  return cart;
}



/* PUT /api/users/[userId]/cart/[productId] */
export interface ProductCartResponse {
  cartItems: CartItem[];
  created: boolean;
}

export async function updateAddCartItem(
  userId: string, 
  productId: string,
  
  qty: number
  ):Promise<ProductCartResponse | null> {
  await connect();
  
  const user = await Users.findById(userId);
  if (!user) {
    return null;
  }
  const product = await Products.findById(productId);
  if (!product) {
    return null;
  }

  var created;

  const cartItem = user.cartItems.find(
    (cartItem: any) => cartItem.product._id.equals(productId)
  );

  if(cartItem){
    cartItem.qty = qty;
    created = false;
  }
  else {
    const newCartItem = {
      //Se crea un nuevo producto
      product: new Types.ObjectId(productId),
      //Se le asigna la cantidad
      qty: qty
    }
    //Añadimos el producto al carrito del usuario
    user.cartItems.push(newCartItem);
    created = true;
  }

  //Guardamos la creacion/modificacion
  await user.save();

  const cartUserProjection = {
    'cartItems.product': true,
    'cartItems.qty': true,
  };

  const productProjection = {
    name: true,
    price: true,
  }

  const cart = await Users.findById(userId,cartUserProjection).populate("cartItems.product",productProjection);

  return {
    cartItems:cart,
    created: created
  }
}



/* DELETE /api/users/[userId]/cart/[productId] */
export interface DeleteProductResponse {
  cartItems: CartItem[];
}

export async function deleteCartItem(userId: string, productId: string): Promise<DeleteProductResponse | null> {
  await connect();

  const user = await Users.findById(userId);
  if (!user) {
    return null;
  }
  const product = await Products.findById(productId);
  if (!product) {
    return null;
  }

  const deletedProduct = user.cartItems.findIndex(
    (cartItem: any) => cartItem.product._id.equals(productId)
  );

  if(deletedProduct !== -1){
    user.cartItems.splice(deletedProduct,1);
  }

  await user.save();

  const cartUserProjection = {
    'cartItems.product': true,
    'cartItems.qty': true,
  };
  
  const productProjection = {
    name:true, 
    price: true,
  }
  
  const cart = await Users.findById(userId, cartUserProjection).populate("cartItems.product", productProjection);

  if (cart === null) {
    return null;
  }

  return cart;
}

