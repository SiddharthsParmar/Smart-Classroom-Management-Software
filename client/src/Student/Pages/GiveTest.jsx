import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

const GiveTest = () => {
  // const { studentId } = useParams();
  const [testPaper, setTestPaper] = useState(null);
  const [mcqAnswers, setMcqAnswers] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tesTid = searchParams.get("tesTid");
  const studentId = searchParams.get("studentId");

  const BearerToken = localStorage.getItem("token");
  useEffect(() => {
    console.log(testPaper, studentId, mcqAnswers);
    console.log("studentid",studentId)

    fetch(
      `https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/getTest?tesTid=${tesTid}`,
      {
        headers: { "Authorization": `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
              "Content-Type": "application/json",},
      }
    )
      .then((res) => res.json())
      .then((data) => setTestPaper(data))
      .catch((err) => console.error("Error fetching test", err));
  }, [tesTid]);

  const handleSelectAnswer = (selectedOption) => {
    setMcqAnswers((prev) => {
      if (prev.includes(selectedOption)) {
        return prev.filter((opt) => opt !== selectedOption); // Deselect if already selected
      } else {
        return [...prev, selectedOption]; // Add selection
      }
    });
  };

  const handleSubmit = () => {
    const payload = {
      mcqAnswers: mcqAnswers,
      theoryAnswers: [],
      studentId:  parseInt(studentId),
    };
console.log(payload);

    fetch(`https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/submit?testId=${tesTid}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
              "Content-Type": "application/json", },
      body: JSON.stringify(payload),
    })
    .then((res) => res.json()) // Convert response to JSON
    .then((data) => {
      console.log("Test submission response:", data); // Log response
      navigate(-1);
    }) // Navigate back after submission
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>{testPaper?.testName || "Loading..."}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {testPaper?.mcqTypeQuetionList?.map((q, index) => (
          <div key={q.id} style={{ marginBottom: "15px" }}>
            <p>{index + 1}. {q.quetion}</p>
            {["A", "B", "C", "D"].map((option) => (
              q[option] && (
                <label key={option} style={{ display: "block", marginLeft: "15px" }}>
                  <input
                    type="checkbox"
                    name={`q${q.id}`}
                    value={option.toLowerCase()}
                    checked={mcqAnswers.includes(option.toLowerCase())}
                    onChange={() => handleSelectAnswer(option.toLowerCase())}
                  /> {q[option]}
                </label>
              )
            ))}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Submit Test
        </button>
      </form>
    </div>
  );
};

export default GiveTest;
