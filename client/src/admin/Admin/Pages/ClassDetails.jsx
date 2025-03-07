import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BearerToken = localStorage.getItem("token");
const ClassDetails = () => {
  const location = useLocation();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacherList, setTeacherList] = useState([]);
  const [showAssignTeacherPopup, setShowAssignTeacherPopup] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const selectedClass = queryParams.get("selectedClass");

  const fetchClassDetails = async () => {
    try {
      const response = await axios.get(
        `https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/getClassDetails?name=${selectedClass}`,
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      setClassDetails(response.data);
    } catch (err) {
      setError("Failed to fetch class details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedClass) {
      setError("Class name is undefined!");
      setLoading(false);
      return;
    }
    fetchClassDetails();
  }, [selectedClass]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/getAllTeachers",
          {
            headers: {
              Authorization: `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );
        setTeacherList(response.data);
      } catch (err) {
        console.error("Error fetching teacher list", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleAssignTeacher = (subject) => {
    setSelectedSubject(subject);
    setShowAssignTeacherPopup(true);
  };

  const handleAssignTeacherSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) {
      alert("Please select a teacher!");
      return;
    }

    try {
      await axios.post(
        `https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/assignTeacher?teacherId=${selectedTeacher}&subCode=${selectedSubject.subCode}&className=${selectedClass}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      alert("Teacher assigned successfully!");
      setShowAssignTeacherPopup(false);
      fetchClassDetails(); // Refetch to update the UI
    } catch (err) {
      alert("Failed to assign teacher.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Class Details for {selectedClass}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(classDetails, null, 2)}
            </pre>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Subjects</h2>
            <ul className="space-y-3">
              {classDetails.subjectDtos &&
                classDetails.subjectDtos.map((subject) => (
                  <li
                    key={subject.subCode}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{subject.subName}</p>
                      <p className="text-sm text-gray-500">
                        Code: {subject.subCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        Teacher:{" "}
                        {subject.teacher ? subject.teacher.name : "Not assigned"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssignTeacher(subject)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Assign Teacher
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}

      {showAssignTeacherPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Assign Teacher to {selectedSubject?.subName}
            </h3>
            <form onSubmit={handleAssignTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Teacher
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a teacher</option>
                  {teacherList.map((teacher) => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Class</label>
                <input
                  type="text"
                  value={selectedClass}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={selectedSubject?.subName}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignTeacherPopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add Subject</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const subCode = e.target.subCode.value;
            const name = e.target.name.value;

            try {
              const response = await axios.post(
                `https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/addSubject?class=${selectedClass}`,
                { subCode, name },
                {
                  headers: {
                    Authorization: `Bearer ${BearerToken}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                  },
                }
              );
              alert("Subject added successfully!");
              fetchClassDetails(); // Refetch to update the subject list
            } catch (err) {
              console.error("Error adding subject:", err.response?.data || err.message);
              alert("Failed to add subject.");
            }
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="subCode" className="block text-sm font-medium mb-2">
              Subject Code
            </label>
            <input
              type="text"
              id="subCode"
              name="subCode"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Add Subject
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClassDetails;