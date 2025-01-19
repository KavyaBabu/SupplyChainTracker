import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import itemRoutes from './routes/itemRoutes'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/items', itemRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Supply Chain API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
