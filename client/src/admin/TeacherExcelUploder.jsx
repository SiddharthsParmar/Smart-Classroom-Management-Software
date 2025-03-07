import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Button,
  Container,
  Typography,
  Box,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f5f5f5",
});

const StyledBox = styled(Box)({
  backgroundColor: "#ffffff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
});

const StyledButton = styled(Button)({
  marginTop: "1rem",
});

const TeacherExcelUploder = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const BearerToken = localStorage.getItem("token");
console.log(BearerToken);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSuccessMessage("");
      setErrorMessage("");

      // Read and parse Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setPreviewData(jsonData.slice(0, 5)); // Show first 5 rows
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("excel", file);

    try {
      const response = await axios.post(
        "https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/register/uploadTeachersExcelSheet",
        formData, // Keep formData separate
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true",
          },
          withCredentials: false,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          },
        }
      );
      

      setSuccessMessage("File uploaded successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Upload Error:", error);

      if (error.response) {
        setErrorMessage(`Server responded with error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setErrorMessage("No response received from the server. Please check the backend.");
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <StyledContainer>
      <StyledBox>
        <Typography variant="h4" gutterBottom>
          Upload Excel File
        </Typography>

        {/* File Input */}
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={{ display: "none" }} id="upload-file" />
        <label htmlFor="upload-file">
          <StyledButton variant="contained" component="span">
            Choose File
          </StyledButton>
        </label>

        {/* File Name Display */}
        {file && (
          <Typography variant="body1" style={{ marginTop: "1rem" }}>
            Selected File: {file.name}
          </Typography>
        )}

        {/* Excel Preview */}
        {previewData.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: "1rem", maxHeight: "200px", overflow: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {previewData[0].map((col, index) => (
                    <TableCell key={index} style={{ fontWeight: "bold" }}>
                      {col || `Column ${index + 1}`}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Upload Button */}
        <StyledButton variant="contained" color="primary" onClick={handleUpload} disabled={uploading} style={{ marginTop: "1rem" }}>
          Upload
        </StyledButton>

        {/* Upload Progress */}
        {uploading && (
          <Box style={{ width: "100%", marginTop: "1rem" }}>
            <LinearProgress variant="determinate" value={progress} />
            <CircularProgress size={24} style={{ marginTop: "1rem" }} />
          </Box>
        )}

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" style={{ marginTop: "1rem" }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" style={{ marginTop: "1rem" }}>
            {errorMessage}
          </Alert>
        )}
      </StyledBox>
    </StyledContainer>
  );
};

export default TeacherExcelUploder;
