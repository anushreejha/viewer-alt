
import React from 'react';
import { Box, IconButton, Typography, Tooltip, Paper } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';

interface ToolbarProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDownload: () => void;
  activeColor: 'yellow' | 'blue' | 'green' | 'pink';
  onColorChange: (color: 'yellow' | 'blue' | 'green' | 'pink') => void;
  isHighlighterActive: boolean;
  onToggleHighlighter: () => void;
  onClearHighlights: () => void;
  totalHighlights: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onDownload,
  activeColor,
  onColorChange,
  isHighlighterActive,
  onToggleHighlighter,
  onClearHighlights,
  totalHighlights,
}) => {
  // Color palette for highlighters
  const colorMap = {
    yellow: '#FEF7CD',
    blue: '#D3E4FD',
    green: '#F2FCE2',
    pink: '#FFDEE2',
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
      }}
      className="animate-slide-up"
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 12,
          py: 1,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2, borderRight: '1px solid #eaeaea' }}>
          <Tooltip title="Zoom Out">
            <IconButton onClick={onZoomOut} size="small" sx={{ color: '#403E43' }}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 40, textAlign: 'center', color: '#403E43' }}>
            {Math.round(scale * 100)}%
          </Typography>
          
          <Tooltip title="Zoom In">
            <IconButton onClick={onZoomIn} size="small" sx={{ color: '#403E43' }}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2, borderRight: '1px solid #eaeaea' }}>
          <Tooltip title={isHighlighterActive ? "Disable Highlighter" : "Enable Highlighter"}>
            <IconButton 
              onClick={onToggleHighlighter} 
              size="small" 
              sx={{ 
                color: isHighlighterActive ? '#6E59A5' : '#403E43',
                backgroundColor: isHighlighterActive ? 'rgba(110, 89, 165, 0.1)' : 'transparent',
              }}
            >
              <BrushIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {isHighlighterActive && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {(['yellow', 'blue', 'green', 'pink'] as const).map((color) => (
                <Tooltip key={color} title={`${color.charAt(0).toUpperCase() + color.slice(1)} Highlighter`}>
                  <Box
                    onClick={() => onColorChange(color)}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: colorMap[color],
                      cursor: 'pointer',
                      border: activeColor === color ? '2px solid #6E59A5' : '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {totalHighlights > 0 && (
            <Tooltip title="Clear All Highlights">
              <IconButton
                onClick={onClearHighlights}
                size="small"
                sx={{ 
                  color: '#F97316',
                  '&:hover': {
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DeleteIcon fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {totalHighlights}
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Download with Highlights">
            <IconButton
              onClick={onDownload}
              size="small"
              sx={{ 
                color: '#6E59A5',
                '&:hover': {
                  backgroundColor: 'rgba(110, 89, 165, 0.1)',
                },
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default Toolbar;
