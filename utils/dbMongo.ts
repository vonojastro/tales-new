import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) {
      throw new Error('MongoDB URI not defined in environment variables')
    }
    
    await mongoose.connect(uri)
    
    console.log('MongoDB connected')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export default connectDB
