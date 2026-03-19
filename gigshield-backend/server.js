require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/earnings', require('./routes/earnings'));
app.use('/api/health', require('./routes/health'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/payouts', require('./routes/payouts'));

app.get('/', (req, res) => res.json({ status: 'GigShield API running' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
