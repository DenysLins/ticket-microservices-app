import { app } from "./app";
import mongoose from "mongoose";

const AUTH_PORT = process.env.AUTH_PORT || 3000;
const AUTH_MONGO_URL = process.env.AUTH_MONGO_URL || "localhost";
const AUTH_MONGO_PORT = process.env.AUTH_MONGO_PORT || 27017;

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${AUTH_MONGO_URL}:${AUTH_MONGO_PORT}/auth`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log(
      `Connected to auth-mongo in ${AUTH_MONGO_URL}:${AUTH_MONGO_PORT}`
    );

    app.listen(AUTH_PORT, () => {
      console.log(`Auth listening on port ${AUTH_PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
};

connectDB();
