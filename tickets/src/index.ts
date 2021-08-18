import { app } from "./app";
import mongoose from "mongoose";

const TICKETS_PORT = process.env.TICKETS_PORT || 3000;
const TICKETS_MONGO_URL = process.env.TICKETS_MONGO_URL || "localhost";
const TICKETS_MONGO_PORT = process.env.TICKETS_MONGO_PORT || 27017;

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${TICKETS_MONGO_URL}:${TICKETS_MONGO_PORT}/tickets`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log(
      `Connected to ticket-mongo in ${TICKETS_MONGO_URL}:${TICKETS_MONGO_PORT}`
    );

    app.listen(TICKETS_PORT, () => {
      console.log(`Auth listening on port ${TICKETS_PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
};

connectDB();
