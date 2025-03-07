import React, { useEffect, useState } from "react";
import { useLocation ,useNavigate ,useSearchParams} from "react-router-dom";

const ViewAnswers = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get("testId");
  const studentId = queryParams.get("studentId");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const BearerToken = localStorage.getItem("token");
const [tests, setTests] = useState([]);
  const [expandedTestId, setExpandedTestId] = useState(null); // Track expanded test
  const [expandedStudentId, setExpandedStudentId] = useState(null); // Track expanded student
  const [selectedPhotos, setSelectedPhotos] = useState([]); // Track selected photos for popup
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Track current photo index
  const [searchParams] = useSearchParams();
  
  const subCode = searchParams.get("subCode");
const navigate = useNavigate();
  useEffect(() => {
    // if (!testId || !studentId) {
    //   setError("none URL parameters.");
    //   setLoading(false);
    //   return;
    // }

    // Fetch the question paper and answers
    fetch(`https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/viewAnswers?studentId=${studentId}&testId=${testId}`, {
      headers: {
        "Authorization": `Bearer ${BearerToken}`,
        "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
        "Content-Type": "application/json",},
      },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data.");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An error occurred while fetching data.");
        setLoading(false);
      });
  }, [testId, studentId]);

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

  const { quetionPaper, answer } = data;
  const viewPhoto = async (studentId) => {
    try {
      const response = await fetch(
        `https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/viewAnswerSheetPhotos?studentId=${studentId}&testId=${testId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BearerToken}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
  
      // Extract base64EncodedPhoto from the array of objects
      const photos = data.map((photo) => photo.base64EncodedPhoto);
  
      if (photos.length > 0) {
        setSelectedPhotos(photos); // Set the fetched photos for the popup
        setCurrentPhotoIndex(0); // Reset to the first photo
      } else {
        alert("No photos found for this student.");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      alert("Failed to fetch photos.");
    }
  };
  const closePhotoPopup = () => {
    setSelectedPhotos([]); // Close the popup
    setCurrentPhotoIndex(0); // Reset the index
  };

  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % selectedPhotos.length);
  };

  const goToPreviousPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? selectedPhotos.length - 1 : prevIndex - 1
    );
  };
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 className="text-2xl font-bold mb-4">Test Answers</h1>

      {/* Question Paper Details */}
      <div style={{ marginBottom: "20px" }}>
        <h2 className="text-xl font-semibold">Question Paper</h2>
        <p><strong>Test ID:</strong> {quetionPaper.id}</p>
        <p><strong>Theory Marks:</strong> {quetionPaper.theoryMarks}</p>
        <p><strong>Start Time:</strong> {quetionPaper.startTime}</p>
        <p><strong>Duration:</strong> {quetionPaper.duration} hour(s)</p>
      </div>

      {/* MCQ Questions */}
      <div style={{ marginBottom: "20px" }}>
        <h2 className="text-xl font-semibold">MCQ Questions</h2>
        {quetionPaper.mcqTypeQuetionList.map((mcq, index) => (
          <div key={mcq.id} style={{ marginBottom: "10px" }}>
            <p><strong>Q{index + 1}:</strong> {mcq.quetion}</p>
            <ul style={{ marginLeft: "20px" }}>
              <li>A: {mcq.A}</li>
              <li>B: {mcq.B}</li>
              <li>C: {mcq.C}</li>
              <li>D: {mcq.D}</li>
            </ul>
            <p><strong>Your Answer:</strong> {answer.mcqAnswers[index]}</p>
          </div>
        ))}
      </div>

      {/* Theory Questions */}
      <div>
        <button type="button" onClick={() => viewPhoto(studentId)}>View Sheet</button>
        <h2 className="text-xl font-semibold">Theory Questions</h2>
        {quetionPaper.theoryQuetions.map((theory, index) => (
          <div key={theory.id} style={{ marginBottom: "10px" }}>
            <p><strong>Q{index + 1}:</strong> {theory.quetion}</p>
            <p><strong>Your Answer:</strong> {answer.theoryAnswers[index]}</p>
            <button
              onClick={() =>
                navigate(`/teacherlayout/teacher/student/aiOverview?testId=${testId}&quetionIndex=${index}&answer=${encodeURIComponent(answer.theoryAnswers[index])}`)
              }
              style={{
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "3px",
                marginTop: "5px",
              }}
            >
              AI Overview
            </button>
          </div>
        ))}
      </div>

      {selectedPhotos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <img
              src={`data:image/jpeg;base64,${selectedPhotos[currentPhotoIndex]}`}
              alt={`Student Photo ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-96"
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={goToPreviousPhoto}
              >
                Previous
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={closePhotoPopup}
              >
                Close
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={goToNextPhoto}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}




    </div>
  );
};

export default ViewAnswers;