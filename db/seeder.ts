import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders from '@/models/Order';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'FC Barcelona Home 24/25',
    description: 'Home jersey 2024/25 with classic blaugrana stripes',
    img: 'https://images.footballkitarchive.com/ckeditor/pictures/data/000/597/102/thumbnail.jpg',
    price: 99.99,
  },
  {
    name: 'Real Madrid Home 24/25',
    description: 'White home jersey 2024/25 with gold details',
    img: 'https://images.footballkitarchive.com/ckeditor/pictures/data/000/581/570/thumbnail.jpg',
    price: 104.99,
  },
  {
    name: 'Manchester City Away 24/25',
    description: 'Away jersey 2024/25 dark edition',
    img: 'https://images.footballkitarchive.com/ckeditor/pictures/data/000/602/622/thumbnail.jpg',
    price: 94.99,
  },
  {
    name: 'Argentina Messi 10 22/23',
    description: 'World Champions edition with name set',
    img: 'https://images.footballkitarchive.com/ckeditor/pictures/data/000/343/457/thumbnail.jpg',
    price: 119.0,
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

  if (conn.connection.db) {
    await conn.connection.db.dropDatabase();
  } else {
    throw new Error('Database connection is undefined.');
  }

  // Ensure empty collections exist
  await Products.createCollection();
  await Users.createCollection();
  await Orders.createCollection();

  const insertedProducts = await Products.insertMany(products);
  console.log(`Inserted products: ${insertedProducts.length}`);

  // Hash passwords
  const [hash1, hash2] = await Promise.all([
    bcrypt.hash('123456', 10),
    bcrypt.hash('654321', 10),
  ])

  // Two sample users
  const user1: User = {
    email: 'johndoe@example.com',
    password: hash1,
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      { product: insertedProducts[0]._id, qty: 2 },
      { product: insertedProducts[1]._id, qty: 5 },
    ],
    orders: [],
  }

  const user2: User = {
    email: 'janedoe@example.com',
    password: hash2,
    name: 'Jane',
    surname: 'Doe',
    address: '456 Second Ave, 67890 Los Angeles, United States',
    birthdate: new Date('1980-05-15'),
    cartItems: [
      { product: insertedProducts[2]._id, qty: 1 },
    ],
    orders: [],
  }

  const [u1, u2] = await Users.insertMany([user1, user2])
  console.log('Inserted users:', JSON.stringify([u1._id, u2._id], null, 2))

  // Create a sample order for the first created user
  const order = await Orders.create({
    user: u1._id,
    date: new Date(),
    address: user1.address,
    cardHolder: `${user1.name} ${user1.surname}`,
    cardNumber: '4242 4242 4242 4242',
    items: [
      { product: insertedProducts[0]._id, qty: 1, price: insertedProducts[0].price },
      { product: insertedProducts[1]._id, qty: 2, price: insertedProducts[1].price },
    ],
  })
  // maintain user's orders reference list as per given model
  await Users.updateOne({ _id: u1._id }, { $push: { orders: order._id } })

  const userProjection = {
    name: true,
    surname: true,
  };
  const productProjection = {
    name: true,
    price: true,
  };
  const retrievedUser = await Users
    .findOne({ email: 'johndoe@example.com' }, userProjection)
    .populate('cartItems.product', productProjection);
  console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);
