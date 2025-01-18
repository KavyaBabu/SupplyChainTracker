import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())
app.use(helmet())

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
  
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
  
export default app;

