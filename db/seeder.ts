import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

//Definimos los productos
const products: Product[] = [
  {
    name: 'El Origen del Planeta de los Simios',
    price: 19.99,
    img: 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/DF6B38BF7C6815039AED50FE55AA3D81D63BCDEB42EE7D902F065EDE3C31DDD1/scale?width=1200&aspectRatio=1.78&format=jpeg',
    synopsis: 'Will Rodman es un joven científico que está investigando con monos para obtener un tratamiento contra el alzheimer, la enfermedad que afecta a su padre. Uno de esos primates, César, experimenta una evolución muy sorprendente en su inteligencia.',
  },
  {
    name: 'Origen',
    price: 20.50,
    img: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2014/06/345894-cine-ciencia-ficcion-critica-origen.jpg?tf=3840x',
    synopsis: 'Dom Cobb es un ladrón capaz de adentrarse en los sueños de la gente y hacerse con sus secretos. Sin embargo, ahora tiene que llevar a cabo una misión diferente a lo que ha hecho siempre: realizar una incepción para implantar una idea en el subconsciente de una persona. El plan se complica debido a la intervención de alguien que parece predecir cada uno de los movimientos de Cobb, alguien a quien solo él puede enfrentarse.',
  },
  {
    name: 'El Corredor del Laberinto',
    price: 15.00,
    img: 'https://i.blogs.es/7ac2f6/650_1000_el-corredor-del-laberinto-1/650_1200.jpg',
    synopsis: 'Thomas es un adolescente cuya memoria fue borrada y que ha sido encerrado junto a otros chicos de su edad en un laberinto plagado de monstruos y misterios. Para sobrevivir, tendrá que adaptarse a las normas y a los demás habitantes del laberinto.',
  },
  {
    name: 'Los Juegos del Hambre',
    price: 25.00,
    img: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2013/01/204562-philip-seymour-hoffman-juegos-hambre.jpg?tf=3840x',
    synopsis: 'Para demostrar su poder, el régimen del estado totalitario de Panem organiza cada año "Los juegos del hambre". En ellos, 24 jóvenes compiten el uno contra el otro en una batalla en la que solo puede haber un superviviente. La joven Katniss se ofrece voluntaria para participar en los juegos para salvar a su hermana. Junto a ella participará Peeta, un joven al que ha conocido desde la infancia y que está enamorado de ella. Sin embargo, el Capitolio quiere convertirlos en contrincantes.',
  },

  ];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  //Borramos bbdd para vovlerla a crear
  await conn.connection.db.dropDatabase();

  //Añadimos todos los productos de arriba
  const insertedProducts = await Products.insertMany(products);

  //Definimos un usuario
  const user: User = {
    email: 'johndoe@example.com',
    password: '1234',
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [],
  };
  //Creamos el usuario
  const res = await Users.create(user);
  console.log(JSON.stringify(res, null, 2));

  //Projections para decidir que campos mostrar
  const userProjection = {
    name: true,
    surname: true,
  };
  const productProjection = {
    name: true,
    price: true,
  };
  
  const retrievedUser = await Users
    .findOne({ email: 'johndoe@example.com' }, userProjection) //Buscamos productos
    .populate('cartItems.product', productProjection); //Le añadimos la informacion de los productos que hay en el cart
  console.log(JSON.stringify(retrievedUser, null, 2));

  

  await conn.disconnect();
}

seed().catch(console.error);