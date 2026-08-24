const {createClient}=require('redis');

const createRedisClient = () => {
    return createClient({
        username: 'default',
        password: process.env.REDIS_KEY,
        socket: {
            host: 'redis-14175.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
            port: 14175,
        },
    });
};

const redis_client = createRedisClient();

module.exports = { redis_client, createRedisClient };