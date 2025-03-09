
import React from 'react';
import { Typography, Box } from '@mui/material';

interface HeaderProps {
  filename: string | null;
}

const Header: React.FC<HeaderProps> = ({ filename }) => {
  return (
    <Box 
      component="header" 
      sx={{
        width: '100%',
        padding: '1rem',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid #eaeaea',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
      className="animate-slide-down"
    >
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#6E59A5', textAlign: 'center' }}>
          PDF Viewer
        </Typography>
        
        {filename && (
          <Box sx={{ mt: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                bgcolor: '#F2FCE2',
                color: '#6E59A5',
                fontWeight: 500
              }}
            >
              {filename}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
