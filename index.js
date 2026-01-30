const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Registration = require('./registrationSchema.js');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://visionaryvibes2026:visionaryvibes2026@cluster0.qqvrp6f.mongodb.net/symposium?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// ── CREATE REGISTRATION ───────────────────────────────────────────────
app.post('/createregistration', async (req, res) => {
    try {
        const {
            eventName,
            participantsName,      // ← array of names
            participantsEmail,     // ← array of emails
            mobile,
            college,
            course,
            city,
            veg,
            nonveg
        } = req.body;

        // ── Basic validation ──────────────────────────────────────
        

        if (participantsName.length < 1 || participantsName.length > 6) {
            return res.status(400).json({
                success: false,
                message: "Team must have between 1 and 6 members"
            });
        }

        if (participantsEmail.length < 1 || participantsEmail.length > 6) {
            return res.status(400).json({
                success: false,
                message: "Team must have between 1 and 6 members"
            });
        }

        const now = new Date();
        // Generate 5-digit ID
        const id = now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0') +
            String(now.getMilliseconds()).padStart(3, '0');

        // Create document - using "id" instead of "registrationId"
        const newRegistration = new Registration({
            id: id,   // ← changed here
            eventName,
            participantsName: participantsName,
            participantsEmail: participantsEmail,
            mobile: mobile?.trim(),
            college: college?.trim(),
            course: course?.trim(),
            city: city?.trim(),
            veg: veg,
            nonveg: nonveg
        });

        await newRegistration.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: newRegistration
        });

    } catch (error) {
        console.error('Registration error:', error);

        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// ── GET ALL REGISTRATIONS (admin/debug) ───────────────────────────────
app.get('/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find()
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching registrations',
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
