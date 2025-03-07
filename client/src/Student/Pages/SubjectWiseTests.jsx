import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubjectWiseTests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const subCode = queryParams.get("subCode");
  const studentId = queryParams.get("studentId"); // ✅ Get studentId from URL params

  const [subjectName, setSubjectName] = useState(null);
  const [activeTests, setActiveTests] = useState([]);
  const [checkedTests, setCheckedTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const BearerToken = localStorage.getItem("token");

  useEffect(() => {
    if (!subCode || !studentId) return;

    // Fetch data from API
    fetch(
      `https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/viewTests?subCode=${subCode}`,
      {
        headers: {
          Authorization: `Bearer ${BearerToken}`,
          "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setSubjectName(data.name);
        setActiveTests(data.active || []);
        setCheckedTests(data.checked || []);
        setCompletedTests(data.complete || []);
        setUpcomingTests(data.upcoming || []);
      })
      .catch((err) => console.error("Error fetching tests", err));
  }, [subCode, studentId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>{subjectName || "Loading..."}</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Active Tests Section */}
        <div>
          <h2>Active Tests</h2>
          {activeTests.length ? (
            activeTests.map((test) => (
              <div
                key={test.testId}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{test.testName}</span>
                <button
                  onClick={() =>
                    navigate(`/teacherlayout/student/getTest?tesTid=${test.testId}&studentId=${studentId}`)
                  }
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "3px",
                  }}
                >
                  Give Test
                </button>
              </div>
            ))
          ) : (
            <p>No active tests available.</p>
          )}
        </div>

        {/* Checked Tests Section */}
        <div>
          <h2>Checked Tests</h2>
          {checkedTests.length ? (
            checkedTests.map((test) => (
              <div
                key={test.testId}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{test.testName}</span>
                <button
                  onClick={() =>
                    navigate(`/teacherlayout/teacher/student/viewResult?tesTid=${test.testId}&studentId=${studentId}`)
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
                  View Result
                </button>
              </div>
            ))
          ) : (
            <p>No checked tests available.</p>
          )}
        </div>

        {/* Completed Tests Section */}
        <div>
          <h2>Completed Tests</h2>
          {completedTests.length ? (
            completedTests.map((test) => (
              <div
                key={test.testId}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{test.testName}</span>
                <button
                  onClick={() =>
                    navigate(`/student/viewResult?tesTid=${test.testId}&studentId=${studentId}`)
                  }
                  style={{
                    backgroundColor: "#198754",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "3px",
                  }}
                >
                  View Result
                </button>
              </div>
            ))
          ) : (
            <p>No completed tests available.</p>
          )}
        </div>

        {/* Upcoming Tests Section */}
        <div>
          <h2>Upcoming Tests</h2>
          {upcomingTests.length ? (
            upcomingTests.map((test) => (
              <div
                key={test.testId}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{test.testName}</span>
                <button
                  style={{
                    backgroundColor: "#ffc107",
                    color: "black",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "not-allowed",
                    borderRadius: "3px",
                  }}
                  disabled
                >
                  Upcoming
                </button>
              </div>
            ))
          ) : (
            <p>No upcoming tests available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectWiseTests;