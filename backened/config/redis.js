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

const RATE_LIMIT_LUA_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], tonumber(ARGV[2]))
end
local ttl = redis.call("TTL", KEYS[1])
return { current, ttl }
`;

const executeAtomicRateLimit = async ({ key, limit, windowSeconds }) => {
  const res = await redis_client.eval(RATE_LIMIT_LUA_SCRIPT, {
    keys: [key],
    arguments: [String(limit), String(windowSeconds)],
  });
  return {
    currentCount: res[0],
    ttl: res[1],
    isBlocked: res[0] > limit,
  };
};

module.exports = { redis_client, createRedisClient, executeAtomicRateLimit };