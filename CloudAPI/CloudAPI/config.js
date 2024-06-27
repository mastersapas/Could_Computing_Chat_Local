module.exports = {
    port: 3002,
    jwtSecret: '!!CryptoCat@!!',
    jwtExpirationInSeconds: 60 * 60, // 1 hour
    MongoDBConnectionString: process.env.DATABASE_URI || "mongodb+srv://2230324:Tt2RzYNLWHi3BFKW@mongodbcluster.fdlgbtu.mongodb.net/",
  }