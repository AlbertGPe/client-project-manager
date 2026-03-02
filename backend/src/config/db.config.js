const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/client-project-manager';

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(MONGODB_URI)
  .then(() => console.info('Successfully connected to the database'))
  .catch((error) => {
    console.error('An error ocurred connecting to the database', error)
    process.exit(1)
  })