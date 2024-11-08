import React, { useState } from 'react';
import './Signup.css'; // Importing the CSS

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        Name: '',
        phno: '',
        gmail: '',
        password: '',
        role: 'customer', // Default role
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        validateField(name, value); // Validate on input change
    };

    // Validate individual fields
    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case 'gmail':
                newErrors.gmail = validateEmail(value);
                break;
            case 'password':
                newErrors.password = validatePassword(value);
                break;
            case 'phno':
                newErrors.phno = validatePhoneNumber(value);
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    // Validate email to include "@" and "."
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email) ? '' : 'Email must contain "@" and "."';
    };

    // Validate password with stronger security
    const validatePassword = (password) => {
        const passwordLength = password.length >= 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!passwordLength) {
            return 'Password must be at least 6 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }

        return '';
    };

    // Validate phone number to have exactly 10 digits and no other characters
    const validatePhoneNumber = (phno) => {
        const phoneNumberPattern = /^[0-9]{10}$/;
        return phoneNumberPattern.test(phno) ? '' : 'Phone number must be exactly 10 digits';
    };

    // Validate the entire form before submission
    const validateForm = () => {
        let validationErrors = {};

        // Username validation
        if (!formData.username) {
            validationErrors.username = 'Username is required';
        }

        // Name validation
        if (!formData.Name) {
            validationErrors.Name = 'Name is required';
        }

        // Phone number validation
        const phnoError = validatePhoneNumber(formData.phno);
        if (phnoError) {
            validationErrors.phno = phnoError;
        }

        // Email validation
        const emailError = validateEmail(formData.gmail);
        if (emailError) {
            validationErrors.gmail = emailError;
        }

        // Password validation
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            validationErrors.password = passwordError;
        }

        setErrors(validationErrors); // Update errors state
        return validationErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            console.log('Form validation failed:', validationErrors); // Debugging: Log errors
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/customers/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({
                    username: '',
                    Name: '',
                    phno: '',
                    gmail: '',
                    password: '',
                    role: 'customer'
                });
                setErrors({});
                alert("Signup successful!"); // Display success alert
                console.log("Signup successful!");
            } else {
                const data = await response.json();
                console.log("Signup failed with error:", data.error); // Debugging: Log error from server
            }
        } catch (err) {
            console.error("Error signing up:", err); // Debugging: Log any caught error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2 className="form-title">Sign Up</h2>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className={errors.username ? 'invalid' : ''}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            <div className="form-group">
                <label>Name</label>
                <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    required
                />
                {errors.Name && <p className="error-message">{errors.Name}</p>}
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <input
                    type="text"
                    name="phno"
                    value={formData.phno}
                    onChange={handleInputChange}
                    required
                    className={errors.phno ? 'invalid' : ''}
                />
                {errors.phno && <p className="error-message">{errors.phno}</p>}
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="gmail"
                    value={formData.gmail}
                    onChange={handleInputChange}
                    required
                    className={errors.gmail ? 'invalid' : ''}
                />
                {errors.gmail && <p className="error-message">{errors.gmail}</p>}
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={errors.password ? 'invalid' : ''}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div className="form-group">
                <label>Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                >
                    <option value="customer">Customer</option>
                    <option value="travel agency">Travel Agency</option>
                    <option value="guide">Guide</option>
                </select>
            </div>
            <button type="submit" className="submit-btn">Sign Up</button>
        </form>
    );
};

export default Signup;
