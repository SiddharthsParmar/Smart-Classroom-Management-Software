import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tesTid = queryParams.get("tesTid");
  const studentId = queryParams.get("studentId");
  const BearerToken = localStorage.getItem("token");

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tesTid || !studentId) {
      setError("Invalid URL parameters.");
      setLoading(false);
      return;
    }

    // Fetch result data from API
    fetch(
      `https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/getResult?testId=${tesTid}&studentId=${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${BearerToken}`,
          "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        console.log(res);
        
        if (!res.ok) {
          throw new Error("Failed to fetch result data.");
        }
        return res.json();
      })
      .then((data) => {
        setResultData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An error occurred while fetching the result.");
        setLoading(false);
      });
  }, [tesTid, studentId, BearerToken]);

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
      <h1 className="text-2xl font-bold mb-4">Test Result</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Student ID */}
        <div>
          <strong>Student ID:</strong> {resultData.studentId}
        </div>

        {/* MCQ Marks */}
        <div>
          <strong>MCQ Marks:</strong> {resultData.mcqMarks}
        </div>

        {/* Theory Marks */}
        <div>
          <strong>Theory Marks:</strong> {resultData.theoryMarks}
        </div>

        {/* Status */}
        <div>
          <strong>Status:</strong>{" "}
          {resultData.status ? (
            <span className="text-green-500">Passed</span>
          ) : (
            <span className="text-red-500">Failed</span>
          )}
        </div>

        {/* View My Answers Button */}
        <button
          onClick={() =>
            navigate(`/teacherlayout/teacher/student/viewAnswers?studentId=${studentId}&testId=${tesTid}`)
          }
          style={{
            backgroundColor: "#0d6efd",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "5px",
            marginTop: "20px",
          }}
        >
          View My Answers
        </button>
      </div>
    </div>
  );
};

export default ViewResult;