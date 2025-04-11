import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {connectDB} from './utils/db.js';
import userRoutes from './routes/user.route.js'
// import sellerRoutes from './routes/seller.route.js'

const app = express();

const allowedOrigins = ['https://fastro.in', 'https://www.fastro.in'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
  
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());

// API's
app.use("/api/v1/user",userRoutes)
// app.use("/api/v1/seller",sellerRoutes)

app.get('/',(req,res)=>{
  res.send("API Working")
})
// Database connection and server start
app.listen(process.env.PORT || 5000, () => { 
    connectDB();  // Call DB connection
    console.log('Server running on port 5000');
});
