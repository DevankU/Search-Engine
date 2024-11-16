import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.delete('http://127.0.0.1:3001/delete-account', { data: formData })
            .then(response => {
                alert(response.data);
                if (response.data === "Account deleted successfully") {
                    navigate('/register'); 
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style={{ backgroundImage: "linear-gradient(#ff4d4d,#ff6666,rgba(255,0,0,.555))" }}>
                <div className="bg-white p-3 rounded" style={{ width: '40%' }}>
                    <h2 className='mb-3 text-danger'>Delete Account</h2>
                    <form onSubmit={handleSubmit}>
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
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                <strong>Password</strong>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="form-control"
                                id="exampleInputPassword1"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-danger">Delete Account</button>
                    </form>

                    {}
                    <p className='mt-3'>
                        Changed your mind? 
                        <a href="/login" className="text-primary ms-2">Back to Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccount;