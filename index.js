const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Registration = require('./MongoDB/registrationSchema.js');

const app = express();

/* ── Middleware ───────────────────────────────── */
app.use(cors({ origin: '*'}));
app.use(express.json());

/* ── MongoDB Lazy Connection ───────────────────── */
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB Connected");
}

/* ── Routes ────────────────────────────────────── */
app.get('/', async (req, res) => {
    await connectDB();
    res.send('API is running...');
});

app.post('/createregistration', async (req, res) => {
    try {
        await connectDB();

        const {
            eventName,
            participantsName,
            participantsEmail,
            mobile,
            college,
            course,
            city,
            veg,
            nonveg
        } = req.body;

        if (participantsName.length < 1 || participantsName.length > 6) {
            return res.status(400).json({ message: "Team must have 1–6 members" });
        }

        const now = new Date();
        const id =
            now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0') +
            String(now.getMilliseconds()).padStart(3, '0');

        const newRegistration = new Registration({
            id,
            eventName,
            participantsName,
            participantsEmail,
            mobile,
            college,
            course,
            city,
            veg,
            nonveg
        });

        await newRegistration.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: newRegistration
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/registrations', async (req, res) => {
    await connectDB();
    const data = await Registration.find();
    res.json(data);
});

/* ── EXPORT (NO app.listen) ────────────────────── */
module.exports = app;
