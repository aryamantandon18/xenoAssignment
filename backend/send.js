const mongoose = require('mongoose');
const Customer = require('./models/Customer'); // your customer model file
const Order = require('./models/Order'); // your order model file
const { faker } = require('@faker-js/faker');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/xenoAssign');

  // Step 1: generate customers
  const customers = [];
  for (let i = 1; i <= 50; i++){
    customers.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase().replace(/'/g, ''),
      phone: faker.phone.number('###-###-####'),
      totalSpent: 0,
      lastOrderAt: null,
      visitCount: 0,
      createdBy: "firebaseUid123",
      createdAt: new Date(),
    });
  }

  // Insert customers
  const insertedCustomers = await Customer.insertMany(customers);
  console.log(`Inserted ${insertedCustomers.length} customers.`);

  // Step 2: generate orders, one per customer
  const productsList = [
    { name: "T-Shirt", price: 19.99 },
    { name: "Jeans", price: 49.99 },
    { name: "Sneakers", price: 89.99 },
    { name: "Hat", price: 14.99 },
    { name: "Jacket", price: 119.99 },
  ];

  const orders = insertedCustomers.map(customer => {
    // random 1-3 products
    const productCount = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];

    for (let i = 0; i < productCount; i++) {
      const product = productsList[Math.floor(Math.random() * productsList.length)];
      selectedProducts.push({
        name: product.name,
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1
      });
    }

    const amount = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return {
      customerId: customer._id,
      products: selectedProducts,
      amount,
      status: "PLACED",
      notes: faker.lorem.sentence(),
      createdBy: "firebaseUid123",
      createdAt: faker.date.recent(30)
    };
  });

  const insertedOrders = await Order.insertMany(orders);
  console.log(`Inserted ${insertedOrders.length} orders.`);

  await mongoose.disconnect();
}

seed().catch(console.error);


// # # backend/Dockerfile

// # FROM node:18

// # # Set working directory inside the container
// # WORKDIR /app

// # # Copy package files from backend folder
// # COPY package*.json ./

// # # Install backend dependencies
// # RUN npm install

// # # Copy all backend source code
// # COPY . .

// # # Default command (can be overridden by docker-compose)
// # CMD ["node", "server.js"]
