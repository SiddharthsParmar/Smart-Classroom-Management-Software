import React, { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tesTid = queryParams.get("tesTid");
    const studentId = queryParams.get("studentId");
    const BearerToken = localStorage.getItem("token");
  useEffect(() => {
    console.log(tesTid);
    console.log(BearerToken);
    console.log(studentId);
    
    
    // Fetch the list of tests (mock API call)
    fetch(`https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/getResult?testId=${tesTid}&studentId=${studentId}`, {
      headers: { "Authorization": `Bearer ${BearerToken}`,
        "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
        "Content-Type": "application/json",},
    })
      .then((res) => {
        console.log(res);
        
        if (!res.ok) {
          throw new Error("Failed to fetch tests.");
        }
        return res.json();
      })
      .then((data) => {
        setTests(data.tests || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An error occurred while fetching tests.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 className="text-2xl font-bold mb-4">My Tests</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tests.length > 0 ? (
          tests.map((test) => (
            <div
              key={test.testId}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Test ID: {test.testId}</span>
              <button
                onClick={() =>
                  navigate(`/student/viewAnswers?studentId=123457&testId=${test.testId}`)
                }
                style={{
                  backgroundColor: "#0d6efd",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "3px",
                }}
              >
                View My Answer
              </button>
            </div>
          ))
        ) : (
          <p>No tests available.</p>
        )}
      </div>
    </div>
  );
};

export default TestList;