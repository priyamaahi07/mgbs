require('dotenv').config();

const cors = require('cors');
const express = require('express');
const connectDB = require('./src/database/connection');

const app = express();

const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
// Enable CORS
app.use(cors());

app.use(express.json());

const invoiceRoutes = require('./src/routes/invoiceRoutes');

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/invoices', invoiceRoutes);

app.post('/login', async (req, res) => {
    try {

        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.status(200).json({
            status: true,
            message: 'Login successful',
            token: token,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
