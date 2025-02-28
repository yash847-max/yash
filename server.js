const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow frontend to send requests

// MongoDB Connection
mongoose.connect('mongodb+srv://yash:yash1234@cluster0.4yla8.mongodb.net/userinput?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Schema & Model
const messageSchema = new mongoose.Schema({
    name: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema, 'message');

// API Route to handle form submission
app.post('/send-message', async (req, res) => {
    const { name, message } = req.body;
    
    if (!name || !message) {
        return res.status(400).json({ message: "❌ Name and message are required!" });
    }

    try {
        const newMessage = new Message({ name, message });
        await newMessage.save();
        res.json({ message: "✅ Message sent successfully!" });
    } catch (error) {
        console.error("❌ Error saving message:", error);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
