import React, { useState, useEffect } from "react";

const StudentInfo = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null); // State to hold the selected file
  const [uploadStatus, setUploadStatus] = useState(""); // To show upload status
  const BearerToken = localStorage.getItem("token");

  // Fetch teacher data from API
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch("https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/home",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${BearerToken}`,
              "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
              "Content-Type": "application/json",
            },
          }
        ); // Replace with your API endpoint
        
        
        if (!response.ok) {
          throw new Error("Failed to fetch teacher data");
        }
        const data = await response.json();
        setTeacherData(data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherData();
  }, []);

  if (!teacherData) {
    return <div className="flex justify-center items-center h-16 bg-gray-800 text-white">Loading...</div>;
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  // Handle photo upload
  
  const handlePhotoUpload = async () => {
    if (!photoFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photoFile);

    try {
      const response = await fetch("https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/uploadPhoto", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BearerToken}`, // Replace with your token retrieval logic
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      const result = await response.json();
      setUploadStatus("Photo uploaded successfully!");
      console.log("Upload successful:", result);

      // Optionally, refetch teacher data to update the photo in the UI
      const updatedTeacherData = await fetch("https://9d11-2409-40c1-4150-76bb-5c2a-b24b-c84-3c83.ngrok-free.app/student/home",{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BearerToken}`,
          "ngrok-skip-browser-warning": "true", // Bypasses ngrok warning
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setTeacherData(updatedTeacherData);
    } catch (error) {
      console.error("Error uploading photo:", error);
      setUploadStatus("Failed to upload photo.");
    }
  };

  return (
    <nav className="flex justify-between items-center h-16 bg-gray-800 text-white px-4">
      {/* Teacher ID on the left */}
      <div className="text-lg font-semibold">
        Student Name:  {teacherData.name}
      </div>

      {/* Teacher Photo on the right */}
      <div className="relative">
        <img
          src={`data:image/jpeg;base64,${teacherData.photo}`}
          alt="Teacher Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Menu Popup */}
        {isMenuOpen && (
          <div className="absolute top-12 right-0 bg-white text-black p-4 rounded shadow-lg z-10 w-64">
            <p className="font-bold">{teacherData.enrollmentNo}</p>
            <p className="text-sm mb-4">{teacherData.className}</p>

            {/* File Input for Photo Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />

            {/* Upload Button */}
            <button
              onClick={handlePhotoUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Upload Photo
            </button>

            {/* Upload Status Message */}
            {uploadStatus && <p className="text-xs mt-2 text-center">non</p>}
          </div>
        )}
      </div>
    </nav>
  );
};

export default StudentInfo;