import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import itemRoutes from './routes/itemRoutes'

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('Supply Chain API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
