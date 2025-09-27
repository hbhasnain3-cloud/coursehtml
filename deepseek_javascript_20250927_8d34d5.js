// backend/src/middleware/cache.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await client.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Override res.json to cache response
      const originalJson = res.json;
      res.json = function(data) {
        client.setex(key, duration, JSON.stringify(data));
        originalJson.call(this, data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cache;