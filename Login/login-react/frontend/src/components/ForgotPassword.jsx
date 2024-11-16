import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        newPassword: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://127.0.0.1:3001/forgot-password', formData)
            .then(response => {
                alert(response.data);
                if (response.data === "Password updated successfully") {
                    navigate('/login'); // Redirect to login page after password reset
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }}>
                <div className="bg-white p-3 rounded" style={{ width: '40%' }}>
                    <h2 className='mb-3 text-primary'>Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputName" className="form-label">
                                <strong>Name</strong>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="form-control"
                                id="exampleInputName"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                <strong>Email Id</strong>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="form-control"
                                id="exampleInputEmail1"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputNewPassword1" className="form-label">
                                <strong>New Password</strong>
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                className="form-control"
                                id="exampleInputNewPassword1"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Reset Password</button>
                    </form>

                    {/* Back to Login Link */}
                    <p className='mt-3'>
                        Remembered your password? 
                        <a href="/login" className="text-primary ms-2">Back to Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;