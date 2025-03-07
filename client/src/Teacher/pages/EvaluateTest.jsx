import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const EvaluateTest = () => {
  const [testDetails, setTestDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const subCode = searchParams.get("subCode");

  useEffect(() => {
   
    const fetchTestDetails = async () => {
        const BearerToken = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://d538-2409-40c1-4106-ae65-246e-b335-3330-3c6b.ngrok-free.app/teacher/generateTest?subCode=${subCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${BearerToken}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            }
        }
        );
        const data = await response.json();
        setTestDetails(data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, []);

  if (!testDetails) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-5 p-4 border rounded-lg bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">{testDetails.name}</h2>

      {/* Theory Questions */}
      <h3 className="font-bold">Theory Questions</h3>
      {testDetails.quetionPaper.theoryQuetions.map(q => (
        <p key={q.id}>{q.quetion}</p>
      ))}

      {/* Answer Key */}
      <h3 className="font-bold mt-4">Answer Key</h3>
      {testDetails.answerKey.theoryAnswers.map((ans, index) => (
        <p key={index}>{ans}</p>
      ))}

      {/* Student List */}
      <h3 className="font-bold mt-4">Students</h3>
      {testDetails.results.map(student => (
        <div key={student.studentId} className="border p-2 rounded-lg flex justify-between">
          <span>Student ID: {student.studentId}</span>
          <div>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2"
              onClick={() => alert(`Fetching answer sheet for ${student.studentId}`)}
            >
              View Answer Sheet
            </button>
            <button
              className="bg-green-600 text-white px-3 py-1 rounded-lg"
              onClick={() => alert(`Submitting marks for ${student.studentId}`)}
            >
              Add Marks
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluateTest;
