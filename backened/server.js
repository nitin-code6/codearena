const express=require('express');
require('dotenv').config() // Load environment variables from .env into process.env
// console.log(process.env.PORT);
const main=require('./config/db');
// console.log(main);
const client = require("./config/redis");
// console.log(client);
const app=express();
const userAuth=require('./Routes/UserAuth');
const cookieParser = require("cookie-parser");
const problemRouter = require('./Routes/problemCreation');
const submitRouter=require('./Routes/codeSubmission');
app.use(express.json());

app.use(cookieParser());
app.use("/problem",problemRouter);
app.use("/user",userAuth);
app.use("/code",submitRouter);

const startServer = async () => {
  try {
    await main(); // DB connect

    await client.connect(); // Redis connect
//     await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result) 
    console.log("Redis connected");


    app.listen(5000, () => {
      console.log("Server running on port " + process.env.PORT);
    });

  } catch (err) {
    console.error("Error occurred:", err);
  }
};

startServer();