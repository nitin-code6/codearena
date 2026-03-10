const {createClient}=require('redis');

const redis_client = createClient({
    username: 'default',
    password: process.env.REDIS_KEY,
    socket: {
         host: 'redis-14175.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 14175,
       
    },

});

module.exports=redis_client;