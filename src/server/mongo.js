const mongoose = require('mongoose');
/**
* Set to Node.js native promises
* Per https://mongoosejs.com/docs/promises.html
*/
mongoose.Promise = global.Promise;

const env = require('./environment');

const mongoUri = `mongodb://${env.accountName}:${env.password}@${env.accountName}.documents.azure.com:${env.port}/${env.databaseName}?ssl=true`;

function connect() {
  mongoose.set('debug', true);
  return mongoose.connect(mongoUri, { useNewUrlParser: true });
}

module.exports = {
  connect,
  mongoose
};