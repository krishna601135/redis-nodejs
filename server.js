import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import axios from 'axios';
import { redisClient, initializeRedisServer } from './db/redis.js';

const app = express();
dotenv.config()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//redis connection
initializeRedisServer().then(() => {
    console.log('Redis server initialized');
});

const port = process.env.PORT || 5000

app.listen(port, () => {
   console.log(`server is running at http://localhost:${port}`)
});


const DEFAULT_EXPIRATION = 3600


//GET - API

app.get('/api/users', async (req, res) => {
   try {
      const cachedUsers = await redisClient.get('users');
      if (cachedUsers !== null) {
         console.log('Cache hit - returning cached users data');
          return res.status(200).json({
            message: 'success',
            data: {
               users: JSON.parse(cachedUsers)
            }
         });
      } else {
         console.log('Cache miss - fetching data from external API');
         const usersResponse = await axios.get('https://gorest.co.in/public/v2/users');
         await redisClient.set('users', JSON.stringify(usersResponse.data), 'EX', DEFAULT_EXPIRATION);
         
         return res.status(200).json({
            message: 'success',
            data: {
               users: usersResponse.data
            }
         });
      }
   } catch (error) {
      console.error('Error in /api/users:', error);
      return res.status(500).json({ message: 'Server error - please try again later' });
   }
});

