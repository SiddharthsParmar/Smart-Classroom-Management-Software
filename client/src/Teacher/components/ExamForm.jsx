import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ExamForm = () => {
  const [searchParams] = useSearchParams();
  const subCode = searchParams.get("subCode");

  const [testName, setTestName] = useState("");
  const [mcqQuestion, setMcqQuestion] = useState("");
  const [mcqOptions, setMcqOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [mcqAnswer, setMcqAnswer] = useState("A");
  const [theoryQuestions, setTheoryQuestions] = useState("");
  const [theoryAnswer, setTheoryAnswer] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [theoryMarks, setTheoryMarks] = useState(50);
  const [startTime, setStartTime] = useState("");

  const [examData, setExamData] = useState({
    name: "",
    answerKey: { mcqAnswers: [], theoryAnswers: [] },
    quetionPaper: {
      theoryMarks: 50,
      startTime: "",
      duration: 1,
      mcqTypeQuetionList: [],
      theoryQuetions: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle MCQ options change
  const handleOptionChange = (e) => {
    setMcqOptions({ ...mcqOptions, [e.target.name]: e.target.value });
  };

  // Add MCQ Question
  const addMcqQuestion = () => {
    if (!mcqQuestion || Object.values(mcqOptions).some((opt) => !opt)) {
      alert("Please enter MCQ question and all 4 options.");
      return;
    }

    const newMcq = { quetion: mcqQuestion, ...mcqOptions };

    setExamData((prev) => ({
      ...prev,
      quetionPaper: {
        ...prev.quetionPaper,
        mcqTypeQuetionList: [...prev.quetionPaper.mcqTypeQuetionList, newMcq],
      },
    }));

    setMcqQuestion("");
    setMcqOptions({ A: "", B: "", C: "", D: "" });
  };

  // Add Theory Question
  const addTheoryQuestion = () => {
    if (!theoryQuestions) {
      alert("Please enter a theory question.");
      return;
    }

    setExamData((prev) => ({
      ...prev,
      quetionPaper: {
        ...prev.quetionPaper,
        theoryQuetions: [
          ...prev.quetionPaper.theoryQuetions,
          { quetion: theoryQuestions },
        ],
      },
    }));

    setTheoryQuestions("");
  };

  // Submit Exam Data
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!subCode) {
      setMessage("Error: Missing Subject Code.");
      setLoading(false);
      return;
    }

    if (!testName) {
      setMessage("Please enter a test name.");
      setLoading(false);
      return;
    }

    if (
      examData.quetionPaper.mcqTypeQuetionList.length === 0 &&
      examData.quetionPaper.theoryQuetions.length === 0
    ) {
      setMessage("Please add at least one question before submitting.");
      setLoading(false);
      return;
    }

    try {
      const BearerToken = localStorage.getItem("token");
      const response = await fetch(
        `https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/teacher/generateTest?subCode=${subCode}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${BearerToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            name: testName,
            answerKey: examData.answerKey,
            quetionPaper: {
              ...examData.quetionPaper,
              theoryMarks: theoryMarks,
              startTime: startTime,
              duration: parseInt(examDuration),
            },
          }),
        }
      );

      if (response.ok) {
        setMessage("Test data submitted successfully!");

        // Reset fields
        setTestName("");
        setExamData({
          name: "",
          answerKey: { mcqAnswers: [], theoryAnswers: [] },
          quetionPaper: {
            theoryMarks: 50,
            startTime: "",
            duration: 1,
            mcqTypeQuetionList: [],
            theoryQuetions: [],
          },
        });
        setMcqQuestion("");
        setMcqOptions({ A: "", B: "", C: "", D: "" });
        setMcqAnswer("");
        setTheoryQuestions("");
        setTheoryAnswer("");
        setExamDuration("");
      } else {
        setMessage("Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("Error connecting to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-6xl m-5 mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center text-black mb-6">
        Create Exam
      </h1>

      {/* Test Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Test Name</label>
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Start Time and Duration */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input
            type="number"
            value={examDuration}
            onChange={(e) => setExamDuration(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      {/* MCQ Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">MCQ Questions</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              value={mcqQuestion}
              onChange={(e) => setMcqQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["A", "B", "C", "D"].map((option) => (
              <div key={option}>
                <label className="block text-sm font-medium text-gray-700">
                  Option {option}
                </label>
                <input
                  type="text"
                  name={option}
                  value={mcqOptions[option]}
                  onChange={handleOptionChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
            <select
              value={mcqAnswer}
              onChange={(e) => setMcqAnswer(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {["A", "B", "C", "D"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={addMcqQuestion}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add MCQ Question
          </button>
        </div>
      </div>

      {/* Theory Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Theory Questions</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <textarea
              value={theoryQuestions}
              onChange={(e) => setTheoryQuestions(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              value={theoryAnswer}
              onChange={(e) => setTheoryAnswer(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows="3"
            />
          </div>
          <button
            onClick={addTheoryQuestion}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Theory Question
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {loading ? "Submitting..." : "Submit Exam Data"}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mt-4 text-center text-sm text-red-600">{message}</div>
      )}
    </div>
  );
};

export default ExamForm;