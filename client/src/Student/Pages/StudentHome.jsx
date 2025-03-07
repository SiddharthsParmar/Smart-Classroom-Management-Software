import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentInfo from "./StudentInfo";

const StudentHome = () => {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();
  const BearerToken = localStorage.getItem("token");

  useEffect(() => {
    console.log(studentData);
    
    fetch("https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/home", {
      headers: { "Authorization": `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
              "Content-Type": "application/json",},
    })
      .then((res) => res.json())
      .then((data) => setStudentData(data))
      .catch((err) => console.error("Error fetching student data", err));
      
      
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
      <h1>Student Dashboard</h1>
      <StudentInfo/>
      {studentData && (
        <div>
          <h2>Welcome, {studentData.name}</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {studentData.subjects.map((subject) => (
              <button
                key={subject.subCode}
                onClick={() =>
                  navigate(`/teacherlayout/teacher/subject?subCode=${subject.subCode}&studentId=${studentData.enrollmentNo}`)
                }
                style={{
                  padding: "10px 15px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHome;








// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const StudentHome = () => {
//   const [subjects, setSubjects] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://192.168.248.28:8080/student/home") // Replace with actual API endpoint
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.subjects) setSubjects(data.subjects);
//       })
//       .catch((err) => console.error("Error fetching subjects", err));
//   }, []);

//   return (
//     <div style={{ padding: "20px", fontFamily: "    " }}>
//       <h1>Student Dashboard</h1>
//       <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//         {subjects.map((subject) => (
//           <button
//             key={subject.subCode}
//             onClick={() => navigate(/subject?subCode=${subject.subCode})}
//             style={{
//               padding: "10px 15px",
//               border: "none",
//               cursor: "pointer",
//               backgroundColor: "#007bff",
//               color: "white",
//               borderRadius: "5px",
//             }}
//           >
//             {subject.name}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StudentHome;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const SubjectWiseTests = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const subCode = queryParams.get("subCode");

//   const [subjectName, setSubjectName] = useState(null);
//   const [activeTests, setActiveTests] = useState([]);
//   const [completedTests, setCompletedTests] = useState([]);
//   const [upcomingTests, setUpcomingTests] = useState([]);

//   useEffect(() => {
//     if (!subCode) return;

//     // Fetch subject name
//     fetch(http://192.168.248.28:8080/student/viewTests?${subCode})
//       .then((res) => res.json())
//       .then((data) => setSubjectName(data.name))
//       .catch((err) => console.error("Error fetching subject", err));

//     // Fetch test data
//     fetch(http://192.168.248.28:8080/student/viewTests?subCode=${subCode})
//       .then((res) => res.json())
//       .then((data) => {
//         setActiveTests(data.active || []);
//         setCompletedTests(data.complete || []);
//         setUpcomingTests(data.upcoming || []);
//       })
//       .catch((err) => console.error("Error fetching tests", err));
//   }, [subCode]);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>{subjectName || "Loading..."}</h1>

//       <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//         {/* Active Tests Section */}
//         <div>
//           <h2>Active Tests</h2>
//           {activeTests.length ? (
//             activeTests.map((test) => (
//               <div
//                 key={test.testId}
//                 style={{
//                   padding: "10px",
//                   border: "1px solid #ddd",
//                   marginBottom: "10px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <span>{test.testName}</span>
//                 <button
//                   onClick={() => navigate(/give-test/${test.testId})}
//                   style={{
//                     backgroundColor: "#28a745",
//                     color: "white",
//                     border: "none",
//                     padding: "5px 10px",
//                     cursor: "pointer",
//                     borderRadius: "3px",
//                   }}
//                 >
//                   Give Test
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p>No active tests available.</p>
//           )}
//         </div>

//         {/* Completed Tests Section */}
//         <div>
//           <h2>Completed Tests</h2>
//           {completedTests.length ? (
//             completedTests.map((test) => (
//               <div key={test.testId} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
//                 {test.testName} - Score: {test.score}
//               </div>
//             ))
//           ) : (
//             <p>No completed tests.</p>
//           )}
//         </div>

//         {/* Upcoming Tests Section */}
//         <div>
//           <h2>Upcoming Tests</h2>
//           {upcomingTests.length ? (
//             upcomingTests.map((test) => (
//               <div
//                 key={test.testId}
//                 style={{
//                   padding: "10px",
//                   border: "1px solid #ddd",
//                   marginBottom: "10px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <span>{test.testName}</span>
//                 <button
//                   style={{
//                     backgroundColor: "#ffc107",
//                     color: "black",
//                     border: "none",
//                     padding: "5px 10px",
//                     cursor: "not-allowed",
//                     borderRadius: "3px",
//                   }}
//                   disabled
//                 >
//                   Upcoming
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p>No upcoming tests.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubjectWiseTests;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const GiveTest = () => {
//   const { testId } = useParams();
//   const [testPaper, setTestPaper] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(http://localhost:8080/api/test/${testId})
//       .then((res) => res.json())
//       .then((data) => setTestPaper(data))
//       .catch((err) => console.error("Error fetching test", err));
//   }, [testId]);

//   const handleSubmit = () => {
//     fetch("http://localhost:8080/api/submit-test", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ testId, answers }),
//     })
//       .then(() => navigate(-1)) // Go back after submission
//       .catch((err) => console.error("Error submitting test", err));
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>{testPaper?.testName || "Loading..."}</h1>
//       <form onSubmit={(e) => e.preventDefault()}>
//         {testPaper?.questions?.map((q, index) => (
//           <div key={q.questionId} style={{ marginBottom: "15px" }}>
//             <p>{index + 1}. {q.question}</p>
//             {q.options.map((opt, i) => (
//               <label key={i} style={{ display: "block", marginLeft: "15px" }}>
//                 <input
//                   type="radio"
//                   name={q${q.questionId}}
//                   value={opt}
//                   onChange={() => setAnswers({ ...answers, [q.questionId]: opt })}
//                 /> {opt}
//               </label>
//             ))}
//           </div>
//         ))}
//         <button
//           onClick={handleSubmit}
//           style={{
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             padding: "10px 15px",
//             cursor: "pointer",
//             marginTop: "10px",
//           }}
//         >
//           Submit Test
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GiveTest;


// {
//     "enrollmentNo": 0,
//     "name": "shrey",
//     "subjects": [
//         {
//             "subCode": 2,
//             "name": "math"
//         }
//     ]
// }
// this object should pass the enrollmentNo of in path variable as studentId
// and then in GiveTest.jsx file that studentId should be sent to api within body 
// {
//     "testId": 1,
//     "startTime": "2025-02-09 17:00:00",
//     "duration": 1,
//     "mcqTypeQuetionList": [
//         {
//             "id": 1,
//             "quetion": "What is the capital of France?",
//             "a": null,
//             "b": null,
//             "c": null,
//             "d": null
//         },
//         {
//             "id": 2,
//             "quetion": "What is the capital of France?",
//             "a": null,
//             "b": null,
//             "c": null,
//             "d": null
//         }
//     ],
//     "theoryQuetions": [
//         {
//             "id": 1,
//             "quetion": "Explain the theory of relativity."
//         }
//     ]
// }
// which sends this data object to the api modify above all the whole code files to achieve this. remaining all the code should be same 
