const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Search-engine');

// CREATE (Register a new user)
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Already registered");
            } else {
                FormDataModel.create(req.body)
                    .then(log_reg_form => res.json(log_reg_form))
                    .catch(err => res.json(err));
            }
        });
});

// READ (Login or find a user by email and password)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // If user found, check password
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("No records found!");
            }
        });
});

// UPDATE (Forgot Password - Update user's password based on name and email)
app.put('/forgot-password', (req, res) => {
    const { name, email, newPassword } = req.body;

    // Find the user by name and email
    FormDataModel.findOne({ name: name, email: email })
        .then(user => {
            if (user) {
                // Update the user's password
                user.password = newPassword;
                user.save()
                    .then(updatedUser => res.json("Password updated successfully"))
                    .catch(err => res.status(500).json("Error updating password"));
            } else {
                res.status(404).json("No user found with the provided name and email");
            }
        })
        .catch(err => res.status(500).json(err));
});

// DELETE (Delete account based on email and password)
app.delete('/delete-account', (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // Check if the provided password matches
                if (user.password === password) {
                    // Delete the user's account
                    FormDataModel.deleteOne({ _id: user._id })
                        .then(() => res.json("Account deleted successfully"))
                        .catch(err => res.status(500).json("Error deleting account"));
                } else {
                    res.status(400).json("Incorrect password");
                }
            } else {
                res.status(404).json("No account found with this email");
            }
        })
        .catch(err => res.status(500).json(err));
});

// Start the server
app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});