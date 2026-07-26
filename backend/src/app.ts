import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import sharingRoutes from './routes/sharing.routes';
import historyRoutes from './routes/history.routes';
import documentRoutes from './routes/document.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', sharingRoutes);
app.use('/api', historyRoutes);
app.use('/api', documentRoutes);

export default app;
