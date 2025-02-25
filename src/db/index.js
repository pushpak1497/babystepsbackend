import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/DoctorAppointment`
    );
    console.log(`\nMongoDB Connected:!!${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR: ", error);
    process.exit(1);
  }
};

export default connectDB;
