import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClassList = () => {
  const [classData, setClassData] = useState([]);
  const [classId, setClassId] = useState('');
  const [name, setName] = useState('');
  const [classClicked, setClickedClass] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  const BearerToken = localStorage.getItem("token");
  const fetchClasses = () => {
    axios.get("https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/home",{
        method: "GET",
            headers: {
              Authorization: `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
    })
      .then(response => {
        const data = response.data;
        const extractedClasses = data.find(item => Array.isArray(item)) || [];
        setClassData(extractedClasses);
        console.log("Processed class list:", extractedClasses);
      })
      .catch(error => {
        console.error("There was an error fetching the class list!", error);
      });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleClassClick = (className) => {
    setClickedClass(className);
    // Navigate to ClassDetails page with selected class as query parameter
    navigate(`/class-details?selectedClass=${encodeURIComponent(className)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!classId || !name) {
      alert("Please enter both Class ID and Name!");
      return;
    }

    axios.post("https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/addClassroom", { classId: Number(classId), name },{
      headers: {
        Authorization: `Bearer ${BearerToken}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        console.log("Class added successfully:", response.data);
        setClassData(prev => [...prev, name]); // Add new class to state
        setClassId('');
        setName('');
      })
      .catch(error => {
        console.error("There was an error adding the class!", error);
      });
  };

  return (
    <>
      <ul>
        {classData.map((item, index) => (
          <li key={index} style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleClassClick(item)}>
            {item}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <label>Class ID</label>
        <input
          type='number'
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />

        <label>Name</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="submit" type='submit'>Submit</button>
      </form>
    </>
  );
};

export default ClassList;
