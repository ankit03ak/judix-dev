# Production Scaling Guide

## Database Optimization

**Indexing:**
```javascript
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
```

**Connection Pooling:**
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

**Sharding:** Shard by `user` field for horizontal scaling

## Caching (Redis)

```javascript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

app.get('/tasks', async (req, res) => {
  const cacheKey = `tasks:${req.user._id}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) return res.json(JSON.parse(cached));
  
  const tasks = await Task.find({ user: req.user._id });
  await redis.setex(cacheKey, 300, JSON.stringify(tasks));
  res.json(tasks);
});
```

## Load Balancing (Nginx)

```nginx
upstream backend {
  server localhost:8080;
  server localhost:8081;
  server localhost:8082;
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
  }
}
```

## Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["8080:8080"]
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on: [mongodb, redis]
  
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
  
  mongodb:
    image: mongo:7
    volumes: [mongo-data:/data/db]
  
  redis:
    image: redis:alpine
  
  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes: [./nginx.conf:/etc/nginx/nginx.conf]

volumes:
  mongo-data:
```

## Monitoring

**PM2:**
```bash
npm install -g pm2
pm2 start src/server.js -i max
pm2 monit
```

**Logging:**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## Security

- **Rate Limiting:** `express-rate-limit` (100 req/15min)
- **Helmet:** Security headers enabled
- **CORS:** Whitelist frontend domain
- **Secrets:** Use environment variables
- **HTTPS:** SSL/TLS certificates (Let's Encrypt)
- **Input Validation:** Sanitize all inputs

## Performance

- **Compression:** `compression` middleware
- **CDN:** Serve static assets via CloudFlare/AWS CloudFront
- **Database Queries:** Use `.lean()` for read-only operations
- **Pagination:** Limit results (e.g., 50 items/page)

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or managed database
- [ ] Configure Redis for caching
- [ ] Set up load balancer
- [ ] Enable HTTPS
- [ ] Configure monitoring (PM2/New Relic)
- [ ] Set up error tracking (Sentry)
- [ ] Implement rate limiting
- [ ] Configure CORS for production domain
- [ ] Set up automated backups
- [ ] Configure CI/CD pipeline
