import { useState } from "react";
import axios from "axios";

const TestPaperUpload = () => {
  const [testId, setTestId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testId || !studentId || selectedFiles.length === 0) {
      return setMessage("Please fill all fields and select files");
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("testId", testId);
      formData.append("studentId", studentId);

      const token = localStorage.getItem("token"); // Get your auth token
      const response = await axios.post(
        "https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/uploadTestPaper",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Upload successful!");
      setTestId("");
      setStudentId("");
      setSelectedFiles([]);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Test Paper</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Test ID</label>
          <input
            type="text"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {selectedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected files: {selectedFiles.map(file => file.name).join(", ")}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Uploading..." : "Upload Test Papers"}
        </button>
      </form>
    </div>
  );
};

export default TestPaperUpload;