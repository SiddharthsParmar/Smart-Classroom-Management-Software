import React, { useState } from "react";
import axios from "axios";

const TeacherRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    id: "500",
    photo: null,
    address: "",
    gender: "",
    age: "",
    email: "",
    password:"",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "photo" && !formData[key]) return; // Prevent appending null file
      data.append(key, formData[key]);
    });

    try {
      const BearerToken = localStorage.getItem("token");
      const response = await axios.post(
        "https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/register/teacher",
        data,
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Teacher registered:", response.data);
    } catch (error) {
      console.error("Error registering teacher:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Teacher Registration</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        type="number"
        name="id"
        placeholder="Teacher ID"
        value={formData.id}
        onChange={handleChange}
        style={styles.input}
        max={999999} // Ensures max 6 digits
        required
        onInput={(e) => {
                    if (e.target.value.length > 6) {
                        e.target.value = e.target.value.slice(0, 6);
                    }
                }}  
      />
      <input type="file" name="photo" accept="image/*" onChange={handleChange} style={styles.input} />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        style={styles.input}
        required
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        title="Please enter a valid email address"
      />
      <input type="password"
       name="password"
       onChange={handleChange}
        placeholder="Password" 
        style={styles.input} required />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        style={styles.input}
        min="18"
        max="100"
        required
      />
      <button type="submit" style={styles.button}>Register Teacher</button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    margin: "auto",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#0056b3",
    color: "white",
    cursor: "pointer",
  },
};

export default TeacherRegistrationForm;
