const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const settlementRoutes = require('./routes/settlements');
const claimRoutes = require('./routes/claims');
const earningsRoutes = require('./routes/earnings');
const lawFirmRoutes = require('./routes/lawFirms');
const questionnaireRoutes = require('./routes/questionnaire');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/lawfirms', lawFirmRoutes);
app.use('/api/questionnaire', questionnaireRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

