require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const callsRouter = require('./routes/calls');

const app  = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/calls', callsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
