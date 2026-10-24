import express from 'express';
import { create } from 'express-handlebars';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
import messagesRouter from './routes/messages.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/messages', messagesRouter);
app.use('/views', viewsRouter);

export default app;
