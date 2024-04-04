import dotenv from 'dotenv';
import app from './app';

dotenv.config();


const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`Server Started on port ${Port}...`); // eslint-disable-line no-console
});