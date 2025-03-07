import React, { useState } from 'react';
import axios from 'axios';

const StudentRegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        enrollmentNumber: '',
        photo: null,
        class: '',
        gender: '',
        age: '',
        address: '' // Added address field
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        try {
            const response = await axios.post('http://192.168.219.28:8080/admin/register/student', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Student registered:', response.data);
        } catch (error) {
            console.error('Error registering student:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2>Student Registration</h2>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} style={styles.input} />
            {/* <input type="number" name="enrollmentNumber" placeholder="Enrollment Number" onChange={handleChange} style={styles.input} /> */}
            <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange} 
                style={styles.input} 
                required 
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                title="Please enter a valid email address."
            />
            <input 
                type="number" 
                name="enrollmentNumber" 
                placeholder="Enrollment Number" 
                onChange={handleChange} 
                style={styles.input} 
                maxLength="6" 
                onInput={(e) => {
                    if (e.target.value.length > 6) {
                        e.target.value = e.target.value.slice(0, 6);
                    }
                }}
            />
            <input type="file" name="photo" onChange={handleChange} style={styles.input} />
            {/* <input type="text" name="class" placeholder="Class" onChange={handleChange} style={styles.input} /> */}
            {/* class drop down */}
            <select name="class" onChange={handleChange} style={styles.input}>
                <option value="">Select Class</option>
                {[...Array(10).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                ))}
            </select>




            <select name="gender" onChange={handleChange} style={styles.input}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input type="number" name="age" placeholder="Age" onChange={handleChange} style={styles.input} />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} style={styles.input} /> {/* Added address field */}
            <button type="submit" style={styles.button}>Register Student</button>
        </form>
    );
};

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        margin: 'auto',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd'
    },
    button: {
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#0056b3',
        color: 'white',
        cursor: 'pointer'
    }
};

export default StudentRegistrationForm;