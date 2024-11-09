import redis from 'redis'
import dotenv from 'dotenv'

dotenv.config()

let redisClient;

const initializeRedisServer = async () => {
    try {
        // Create Redis client
        redisClient = redis.createClient({
            url: `redis://127.0.0.1:${process.env.REDIS_PORT}` // Ensure correct Redis port
        });

        // Handle Redis errors
        redisClient.on('error', (err) => {
            console.error(`Redis error: ${err.message}`);
        });

        await redisClient.connect();
        console.log('Connected to Redis');
        
    } catch (err) {
        console.error(`Failed to connect to Redis: ${err.message}`);
        }
} 


export { redisClient, initializeRedisServer };
