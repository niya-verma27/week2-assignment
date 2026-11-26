const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 1. MongoDB Connection (अपना MongoDB URL यहाँ डालें)
mongoose.connect('mongodb://127.0.0.1:27017/employeeDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('DB Connection Error:', err));

// 2. Database Schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    role: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// 3. REST API Endpoints (CRUD)

// CREATE: नया कर्मचारी जोड़ें
app.post('/api/employees', async (req, res) => {
    try {
        const newEmp = new Employee(req.body);
        await newEmp.save();
        res.status(201).json(newEmp);
    } catch (err) {
        res.status(400).json({ error: 'please fill in all fields correctly' });
    }
});

// READ: सभी कर्मचारियों की लिस्ट लाएं
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// UPDATE: कर्मचारी की जानकारी अपडेट करें
app.put('/api/employees/:id', async (req, res) => {
    try {
        const updatedEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEmp);
    } catch (err) {
        res.status(400).json({ error: 'failed to update' });
    }
});

// DELETE: कर्मचारी को हटाएं
app.delete('/api/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'employee deleted' });
    } catch (err) {
        res.status(400).json({ error: 'failed to delete' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));