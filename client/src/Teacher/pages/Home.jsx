import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TeacherInfo from "../components/TeacherInfo";

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      const BearerToken = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/teacher/home",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.subjects && Array.isArray(data.subjects) && data.subjects.length > 0) {
          setSubjects(data.subjects);

          // Get subCode from URL or set the first subject as the default active tab
          const urlSubCode = searchParams.get("subCode");
          const initialSubCode = urlSubCode || data.subjects[0].subCode;
          setActiveTab(initialSubCode);
        } else {
          console.error("No subjects found in API response");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [searchParams]);

  const handleTabClick = (subCode) => {
    setActiveTab(subCode);
    setSearchParams({ subCode }); // Update URL dynamically
    navigate(`/teacherlayout/teacher/getTests?subCode=${subCode}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10  p-6 bg-white shadow-lg rounded-lg">
      <TeacherInfo />   
      {/* Teacher Info */}

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-200 pb-2">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <button
              key={subject.subCode}
              onClick={() => handleTabClick(subject.subCode)}
              className={`py-2 px-4 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === subject.subCode
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {subject.name}
            </button>
          ))
        ) : (
          <p className="text-gray-500 py-2 px-4">No subjects found</p>
        )}
      </div>

      {/* Content */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
        {activeTab ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Subject Code: <span className="text-blue-500">{activeTab}</span>
            </h2>
            <p className="text-gray-600">
              Here you can view tests, assignments, and other resources related to this subject.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading subjects...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;