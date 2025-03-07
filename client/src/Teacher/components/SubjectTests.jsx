import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const BearerToken = localStorage.getItem("token");

const SubjectTests = () => {
  const [tests, setTests] = useState([]);
  const [expandedTestId, setExpandedTestId] = useState(null); // Track expanded test
  const [expandedStudentId, setExpandedStudentId] = useState(null); // Track expanded student
  const [selectedPhotos, setSelectedPhotos] = useState([]); // Track selected photos for popup
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Track current photo index
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subCode = searchParams.get("subCode");

  useEffect(() => {
    if (!subCode) return;

    const fetchTests = async () => {
      try {
        const response = await fetch(
          `https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/teacher/getTests?subCode=${subCode}`,
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
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, [subCode]);

  // Categorize tests
  const checkedTests = tests.filter(test => test.results.some(r => r.status));
  const upcomingTests = tests.filter(test => new Date(test.quetionPaper.startTime) > new Date());
  const activeTests = tests.filter(test => {
    const startTime = new Date(test.quetionPaper.startTime);
    const endTime = new Date(startTime.getTime() + test.quetionPaper.duration * 60 * 60 * 1000);
    return new Date() >= startTime && new Date() < endTime;
  });
  const completedTests = tests.filter(test => test.status === "complete");

  const toggleExpand = (testId) => {
    setExpandedTestId(expandedTestId === testId ? null : testId);
  };

  const viewAnswerSheet = (studentId) => {
    setExpandedStudentId(expandedStudentId === studentId ? null : studentId);
  };
  const publishResult = () => {
    try{
      fetch(`https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/teacher/publishResult?testId=${expandedTestId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BearerToken}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
    }
    catch(e){
      console.log("failed to publish" , e);
      alert("Failed to publish result");


    }

   
  }

  const addMarks = (studentId) => {
    const marks = prompt(`Enter marks for student ID: ${studentId}`);
    if (marks !== null) {
      alert(`Submitting marks ${marks} for student ID: ${studentId}`);
      fetch(`https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/teacher/addTheoryMarks?studentId=${studentId}&testId=${expandedTestId}&&marks=${marks}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BearerToken}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
    }
  };

  const viewPhoto = async (studentId) => {
    try {
      const response = await fetch(
        `https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/teacher/viewAnswerSheetPhotos?studentId=${studentId}&testId=${expandedTestId}`,
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
    <div className="w-full max-w-4xl mx-auto mt-5 p-4 border rounded-lg bg-gray-100">
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={() => navigate(`/teacherlayout/teacher/generate-test?subCode=${subCode}`)}
      >
        Generate Test
      </button>

      <TestSection title="Checked Tests" tests={checkedTests} navigate={navigate} />
      <TestSection title="Upcoming Tests" tests={upcomingTests} navigate={navigate} />
      <TestSection title="Active Tests" tests={activeTests} navigate={navigate} />

      {/* Completed Tests with Evaluation Section */}
      <div>
        <h2 className="text-xl font-bold mt-4">Completed Tests</h2>
        {completedTests.length === 0 ? (
          <p>No completed tests</p>
        ) : (
          completedTests.map(test => (
            <div key={test.id} className="border p-2 rounded-lg mt-2">
              <div className="flex justify-between">
                <span className="cursor-pointer font-semibold" onClick={() => toggleExpand(test.id)}>
                  {test.name}
                </span>
                <button  className="bg-blue-600 text-white px-3 py-1 rounded-lg" 
                onClick={publishResult}
                >
            Publish result

                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => toggleExpand(test.id)}
                >
                  {expandedTestId === test.id ? "Hide Details" : "Evaluate"}
                </button>
              </div>

              {/* Expanded Section for Evaluation */}
              {expandedTestId === test.id && (
                <div className="mt-4 bg-gray-200 p-3 rounded-lg">
                  <h3 className="font-bold">Theory Questions</h3>
                  {test.quetionPaper.theoryQuetions.map(q => (
                    <p key={q.id}>{q.quetion}</p>
                  ))}

                  <h3 className="font-bold mt-4">Answer Key</h3>
                  {test.answerKey.theoryAnswers.map((ans, index) => (
                    <p key={index}>{ans}</p>
                  ))}

                  <h3 className="font-bold mt-4">Students</h3>
                  {test.results.length === 0 ? (
                    <p>No students attempted this test</p>
                  ) : (
                    test.answers.map(student => (
                      <div key={student.studentId} className="border p-2 rounded-lg flex justify-between mt-2">
                        <span className="cursor-pointer" onClick={() => viewAnswerSheet(student.studentId)}>
                          Student ID: {student.studentId}
                        </span>
                        <div>
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2"
                            onClick={() => viewAnswerSheet(student.studentId)}
                          >
                            View Answer Sheet
                          </button>
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded-lg mr-2"
                            onClick={() => addMarks(student.studentId)}
                          >
                            Add Marks
                          </button>
                          <button
                            className="bg-purple-600 text-white px-3 py-1 rounded-lg"
                            onClick={() => viewPhoto(student.studentId)}
                          >
                            View Photos
                          </button>
                        </div>

                        {/* Expanded Section for Student Answers */}
                        {expandedStudentId === student.studentId && (
                          <div className="mt-4 bg-gray-300 p-3 rounded-lg w-full">
                            <h3 className="font-bold">Student Answers</h3>
                            {student.theoryAnswers.map((answer, index) => (
                              <p key={index}>{answer}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Photo Popup */}
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

const TestSection = ({ title, tests, navigate }) => (
  <div>
    <h2 className="text-xl font-bold mt-4">{title}</h2>
    {tests.length === 0 ? (
      <p>No {title.toLowerCase()}</p>
    ) : (
      tests.map(test => (
        <div
          key={test.id}
          className="border p-2 rounded-lg mt-2 cursor-pointer hover:bg-gray-200"
          onClick={() => navigate(`/teacherlayout/teacher/test-details?testId=${test.id}`)}
        >
          {test.name}
        </div>
      ))
    )}
  </div>
);

export default SubjectTests;