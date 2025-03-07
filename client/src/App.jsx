  import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
  import "./App.css";
  import AdminHome from "./admin/Admin/AdminHome";
  import StudentList from "./admin/Admin/Pages/StudentList";
  import AdminClass from "./admin/Admin/Pages/AdminClass";
  import ExamForm from "./Teacher/components/ExamForm";
  import Layout from "./Teacher/Layout";
  import About from "./Teacher/pages/About";
  import Contact from "./Teacher/pages/Contact";
  import Home from "./Teacher/pages/Home";
  import SubjectTests from "./Teacher/components/SubjectTests";
  import StudentHome from "./Student/Pages/StudentHome";
  import SubjectWiseTest from "./Student/Pages/SubjectWiseTests";
  import GiveTest from "./Student/Pages/GiveTest";
  import SubjectWiseTests from "./Student/Pages/SubjectWiseTests";
  import Login from "./Login";
import AppLayout from "./AppLayout";
import GenerateTest from "./Teacher/components/GenerateTest";
import EvaluateTest from "./Teacher/pages/EvaluateTest";
import ViewResult from "./Student/Pages/ViewResult";
import ViewAnswers from "./Student/Pages/ViewAnswer";
import AiOverview from "./Student/Pages/AiOverview";
import ExcelUploader from "./admin/StudentExcelUploader";
import TeacherRegistrationForm from "./Teacher/components/TeacherRegistrationForm ";
import ClassList from "./admin/Admin/Components/ClassData";
import ClassDetails from "./admin/Admin/Pages/ClassDetails";
import TeacherExcelUploder from "./admin/TeacherExcelUploder"
import StudentRegistration from "./admin/Admin/Pages/StudentRegistration";
import SendNotifications from "./admin/Admin/Pages/SendNotifications";
import TestPaperUpload from "./admin/Admin/Pages/TestPaperUpload";
  

  function App() {
    return (
      <>
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
          <Route path='/class' element={<ClassList />} />
        <Route path='/class-details' element={<ClassDetails />} />
        <Route path='/class-details/:name' element={<ClassDetails />} />
            <Route index element={<AdminHome />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="/excelupload" element={<ExcelUploader />} />
            <Route path="/excelupload" element={<ExcelUploader />} />
            <Route path="/teacherexcelupload" element={<TeacherExcelUploder />}/>
            <Route path="/teacherRegistration" element={<TeacherRegistrationForm />} />
            <Route path="/studentRegistration" element={<StudentRegistration/>}/>
            <Route path="/testpaperupload" element={<TestPaperUpload />} />
<Route path="/notify" element={<SendNotifications />} />
          {/* <Route path="/student" element={<StudentList />} /> */ } 
          <Route path="/class" element={<AdminClass />} />

          </Route>

          <Route path="/teacherlayout" element={<AppLayout />}>
          <Route path="/teacherlayout/teacher/subjects" element={<Home />} />
          <Route path="/teacherlayout/teacher/getTests" element={<SubjectTests />} />
          {/* <Route path="/teacherlayout/teacher/generate" element={<ExamForm />} /> Route for ExamForm */}
          <Route path="/teacherlayout/teacher/generate-test" element={<ExamForm />} />
          <Route path="/teacherlayout/teacher/student" element={<StudentHome />} />
          <Route path="/teacherlayout/teacher/subject" element={<SubjectWiseTests />} />
          {/* <Route path="/subject/student/getTest/:studentId/:testId" element={<GiveTest />} /> */}
          <Route path="/teacherlayout/student/getTest" element={<GiveTest />} />
          <Route path="/teacherlayout/teacher/evaluate-test" element={<EvaluateTest />} />
          <Route path="/teacherlayout/teacher/student/viewResult" element={<ViewResult />} />
          <Route path="/teacherlayout/teacher/student/viewAnswers" element={<ViewAnswers />} />
          <Route path="/teacherlayout/teacher/student/aiOverview" element={<AiOverview />} />
          </Route>
        </Routes>
      
      </>
    );
  }

  export default App;
