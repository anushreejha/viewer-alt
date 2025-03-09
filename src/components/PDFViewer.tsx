
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Toolbar from '@/components/Toolbar';
import {
  generateHighlightId,
  getPageText,
  downloadPdfWithHighlights,
} from '@/utils/pdfUtils';
import { Highlight } from '@/types';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: (error: Error) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onLoadSuccess, onLoadError }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentScale, setCurrentScale] = useState<number>(1.0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlighterActive, setIsHighlighterActive] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<'yellow' | 'blue' | 'green' | 'pink'>('yellow');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfDocument(pdfjs.getDocument(URL.createObjectURL(file as File)));
    setIsLoading(false);
    
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
  }, [file, onLoadSuccess]);

  const handleDocumentLoadError = useCallback((error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    
    if (onLoadError) {
      onLoadError(error);
    }
  }, [onLoadError]);

  const zoomIn = useCallback(() => {
    setCurrentScale((prevScale) => Math.min(prevScale + 0.1, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setCurrentScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  }, []);

  const toggleHighlighter = useCallback(() => {
    setIsHighlighterActive((prev) => !prev);
  }, []);

  const changeHighlighterColor = useCallback((color: 'yellow' | 'blue' | 'green' | 'pink') => {
    setActiveColor(color);
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlights([]);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!file || !pdfDocument) return;
    
    try {
      await downloadPdfWithHighlights(
        pdfDocument,
        highlights,
        `highlighted_${file.name}`
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }, [file, highlights, pdfDocument]);

  const createHighlightFromSelection = useCallback(async (pageNumber: number) => {
    if (!selection || !isHighlighterActive) return;
    
    const selectionRange = selection.getRangeAt(0);
    const textContent = selection.toString();
    
    if (!textContent.trim()) return;
    
    const textLayer = document.querySelector(`.react-pdf__Page[data-page-number="${pageNumber}"] .react-pdf__Page__textContent`);
    if (!textLayer) return;
    
    const clientRects = Array.from(selectionRange.getClientRects());
    
    if (clientRects.length === 0) return;
    
    const { left: layerLeft, top: layerTop } = textLayer.getBoundingClientRect();
    
    const rects = clientRects.map((rect) => {
      const x1 = (rect.left - layerLeft) / currentScale;
      const y1 = (rect.top - layerTop) / currentScale;
      const x2 = (rect.right - layerLeft) / currentScale;
      const y2 = (rect.bottom - layerTop) / currentScale;
      const width = rect.width / currentScale;
      const height = rect.height / currentScale;
      
      return { x1, y1, x2, y2, width, height };
    });
    
    const boundingRect = {
      x1: Math.min(...rects.map(r => r.x1)),
      y1: Math.min(...rects.map(r => r.y1)),
      x2: Math.max(...rects.map(r => r.x2)),
      y2: Math.max(...rects.map(r => r.y2)),
      width: Math.max(...rects.map(r => r.x2)) - Math.min(...rects.map(r => r.x1)),
      height: Math.max(...rects.map(r => r.y2)) - Math.min(...rects.map(r => r.y1)),
    };
    
    const newHighlight: Highlight = {
      id: generateHighlightId(),
      pageNumber,
      position: {
        boundingRect,
        rects,
        pageWidth: textLayer.clientWidth / currentScale,
        pageHeight: textLayer.clientHeight / currentScale,
      },
      color: activeColor,
      content: textContent,
      createdAt: Date.now(),
    };
    
    setHighlights((prevHighlights) => [...prevHighlights, newHighlight]);
    window.getSelection()?.removeAllRanges();
  }, [selection, isHighlighterActive, currentScale, activeColor]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const newSelection = window.getSelection();
      setSelection(newSelection);
      
      if (newSelection && newSelection.toString().trim().length > 0) {
        setIsSelecting(true);
      } else {
        setIsSelecting(false);
      }
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent, pageNumber: number) => {
    if (isHighlighterActive && selection && selection.toString().trim()) {
      createHighlightFromSelection(pageNumber);
    }
  }, [isHighlighterActive, selection, createHighlightFromSelection]);

  const renderHighlights = useCallback((pageNumber: number) => {
    const pageHighlights = highlights.filter(h => h.pageNumber === pageNumber);
    
    return pageHighlights.map((highlight) => (
      <div key={highlight.id}>
        {highlight.position.rects.map((rect, index) => (
          <div
            key={`${highlight.id}-${index}`}
            className={`highlight ${highlight.color}`}
            style={{
              position: 'absolute',
              left: `${rect.x1 * currentScale}px`,
              top: `${rect.y1 * currentScale}px`,
              width: `${rect.width * currentScale}px`,
              height: `${rect.height * currentScale}px`,
              pointerEvents: 'none',
            }}
            title={highlight.content}
          />
        ))}
      </div>
    ));
  }, [highlights, currentScale]);

  const renderPage = useCallback((pageNumber: number) => (
    <div className="relative page-container" key={`page-${pageNumber}`}>
      <Page
        pageNumber={pageNumber}
        scale={currentScale}
        className="pdf-page"
        renderTextLayer={true}
        renderAnnotationLayer={true}
        onMouseUp={(e) => handleMouseUp(e, pageNumber)}
      />
      <div className="highlight-layer">
        {renderHighlights(pageNumber)}
      </div>
    </div>
  ), [currentScale, handleMouseUp, renderHighlights]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box 
        ref={containerRef}
        sx={{ 
          flex: 1, 
          position: 'relative',
          overflowY: 'auto',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          bgcolor: 'white',
        }}
        className="pdf-viewer-container"
      >
        {isLoading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <CircularProgress sx={{ color: '#6E59A5' }} />
          </Box>
        )}
        
        {file ? (
          <Document
            file={file}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            className="flex flex-col items-center py-6 animate-fade-in"
          >
            {numPages && Array.from(new Array(numPages), (_, index) => renderPage(index + 1))}
          </Document>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#8A898C'
          }}>
            No PDF loaded
          </Box>
        )}
      </Box>
      
      {file && numPages && (
        <Toolbar
          scale={currentScale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onDownload={handleDownload}
          activeColor={activeColor}
          onColorChange={changeHighlighterColor}
          isHighlighterActive={isHighlighterActive}
          onToggleHighlighter={toggleHighlighter}
          onClearHighlights={clearHighlights}
          totalHighlights={highlights.length}
        />
      )}
    </Box>
  );
};

export default PDFViewer;
