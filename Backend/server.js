const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');


process.on('uncaughtException',err=>{
  console.log(err.name);
  console.log(err.message);
  console.log('Uncaught exception , Server closing soon ...');
  process.exit(1);
})

const DB = process.env.DATABASE.replace(
  '<PASSWORD>', 
  process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB,{
      useNewUrlParser: true,
      useUnifiedTopology : true,
})
  .then(() => console.log('DB connection successful!'));

const port = 3001;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
