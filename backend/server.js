const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// OR you can be explicit like this:
app.use(cors({ origin: '*' }));
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const leadRoutes = require('./routes/lead');
app.use('/api/leads', leadRoutes);

const clientRoutes = require('./routes/client');
app.use('/api/clients', clientRoutes);

const projectRoutes = require('./routes/project');
app.use('/api/projects', projectRoutes);

const overviewRoutes = require('./routes/overview');
app.use('/api/overview', overviewRoutes);

const staffRoutes = require('./routes/staff');
app.use('/api/staff', staffRoutes);

const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('Mini CRM Backend Running...');
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Mongo Error:', err));

app.listen(5000, () => console.log('Server running on port 5000'));
