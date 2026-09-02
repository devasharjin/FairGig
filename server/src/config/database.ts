import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
 try {
        const URI : string = process.env.MONGODB_URI as string
        await mongoose.connect(URI)
        console.log('DB connected')
    } catch (error) {
        console.log('db connection failed');
        console.log(error)
        process.exit(1)
              
    }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};
