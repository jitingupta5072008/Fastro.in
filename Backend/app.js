import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {connectDB} from './utils/db.js';
import userRoutes from './routes/user.route.js'
import sellerRoutes from './routes/seller.route.js'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
  
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());

// API's
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/seller",sellerRoutes)

app.get('/',(req,res)=>{
  res.send("API Working")
})
// Database connection and server start
app.listen(process.env.PORT || 5000, () => { 
    connectDB();  // Call DB connection
    console.log('Server running on port 5000');
});
