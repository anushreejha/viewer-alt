
import React, { useCallback, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isUploading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const showToast = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        showToast("Please upload a PDF document", "error");
      }
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        showToast("Please upload a PDF document", "error");
      }
    }
  }, [onFileSelect]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 250,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          border: '2px dashed',
          borderColor: isDragActive ? '#6E59A5' : '#e0e0e0',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          backgroundColor: isDragActive ? 'rgba(110, 89, 165, 0.05)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          opacity: isUploading ? 0.5 : 1,
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isDragActive ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="animate-fade-in"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box 
            sx={{ 
              p: 2, 
              mb: 2, 
              borderRadius: '50%', 
              bgcolor: 'rgba(110, 89, 165, 0.1)',
              color: '#6E59A5',
              animation: isDragActive ? 'float 3s ease-in-out infinite' : 'none'
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" sx={{ mb: 1, color: '#403E43', fontWeight: 500 }}>
            {isDragActive ? "Drop PDF here" : "Upload PDF document"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#8A898C' }}>
            Drag and drop a PDF file here, or click to select
          </Typography>
          <Button
            component="label"
            variant="contained"
            disabled={isUploading}
            sx={{
              px: 3,
              py: 1,
              bgcolor: '#6E59A5',
              '&:hover': {
                bgcolor: '#7E69AB',
              },
              boxShadow: '0 4px 10px rgba(110, 89, 165, 0.2)',
            }}
          >
            {isUploading ? "Uploading..." : "Select File"}
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </Button>
        </Box>
      </Box>
      
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadZone;
