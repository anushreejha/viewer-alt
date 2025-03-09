
import React, { useState, useCallback } from 'react';
import { Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import PDFViewer from '@/components/PDFViewer';

const Index = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  
  const handleFileSelect = useCallback(async (file: File) => {
    setIsUploading(true);
    
    try {
      setPdfFile(file);
      showToast('success', `${file.name} is ready to view`);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      showToast('error', 'An error occurred while uploading the PDF');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const showToast = (severity: 'success' | 'error' | 'info', message: string) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#F6F6F7',
      backgroundImage: 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
    }}>
      <Header filename={pdfFile?.name || null} />
      
      <Container sx={{ flex: 1, py: 4, px: 2, display: 'flex', flexDirection: 'column' }}>
        {!pdfFile ? (
          <Box sx={{ maxWidth: 600, width: '100%', mx: 'auto', className: "animate-scale-in" }}>
            <Typography 
              variant="h4" 
              align="center" 
              sx={{ mb: 4, mt: 6, fontWeight: 600, color: '#6E59A5' }}
            >
              Upload your PDF document
            </Typography>
            <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />
          </Box>
        ) : (
          <Box sx={{ flex: 1, height: 'calc(100vh - 10rem)' }}>
            <PDFViewer file={pdfFile} />
          </Box>
        )}
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Index;
