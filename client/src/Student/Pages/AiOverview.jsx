import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AiOverview = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get("testId");
  const quetionIndex = queryParams.get("quetionIndex");
  const answer = queryParams.get("answer");

  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BearerToken = localStorage.getItem("token");
  useEffect(() => {
    if (!testId || !quetionIndex || !answer) {
      setError("Invalid URL parameters.");
      setLoading(false);
      return;
    }

    // Fetch AI overview data
    fetch(
        `https://a1bb-2409-40c1-4146-6629-21c9-5ccf-805-3e70.ngrok-free.app/student/getAiOverview?testId=${testId}&quetionIndex=${quetionIndex}&answer=${encodeURIComponent(answer)}`,
        {
          headers: {
            "Authorization": `Bearer ${BearerToken}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch AI overview.");
          }
      
          const contentType = res.headers.get("content-type");
          
          if (contentType && contentType.includes("application/json")) {
            return res.json(); // Parse as JSON
          } else {
            return res.text(); // Parse as plain text
          }
        })
        .then((data) => {
          console.log("API Response:", data); // Debugging log
      
          // Ensure aiResponse is always a string
          setAiResponse(typeof data === "string" ? data : JSON.stringify(data));
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "An error occurred while fetching AI overview.");
          setLoading(false);
        });
      
  }, [testId, quetionIndex, answer]);

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
      <h1 className="text-2xl font-bold mb-4">AI Overview</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Test ID */}
        <p><strong>Test ID:</strong> {testId}</p>

        {/* Question Index */}
        <p><strong>Question Index:</strong> {quetionIndex}</p>

        {/* Student's Answer */}
        <p><strong>Your Answer:</strong> {decodeURIComponent(answer)}</p>

        {/* AI Feedback */}
        <p><strong>AI Feedback:</strong></p>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            whiteSpace: "pre-wrap", // Ensures line breaks in the response are preserved
          }}
        >
          {aiResponse}
        </div>
      </div>
    </div>
  );
};

export default AiOverview;