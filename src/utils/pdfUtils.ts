
import { Highlight } from "../types";
import { PDFDocumentProxy } from "@/types";

// Initialize worker happens in PDFViewer.tsx

export const generateHighlightId = (): string => {
  return `highlight-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const getPageText = async (pdf: PDFDocumentProxy, pageNumber: number): Promise<string> => {
  try {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ');
  } catch (error) {
    console.error(`Error extracting text from page ${pageNumber}:`, error);
    return "";
  }
};

export const addHighlightsToPage = (
  pageCanvas: HTMLCanvasElement,
  highlights: Highlight[],
  pageNumber: number,
  scale: number
): void => {
  const highlightLayer = document.createElement('div');
  highlightLayer.className = 'highlight-layer';
  
  highlights
    .filter(highlight => highlight.pageNumber === pageNumber)
    .forEach(highlight => {
      const { rects } = highlight.position;
      
      rects.forEach(rect => {
        const highlightElement = document.createElement('div');
        highlightElement.className = `highlight ${highlight.color}`;
        highlightElement.dataset.id = highlight.id;
        
        // Scale the rectangle to match the current zoom level
        highlightElement.style.left = `${rect.x1 * scale}px`;
        highlightElement.style.top = `${rect.y1 * scale}px`;
        highlightElement.style.width = `${rect.width * scale}px`;
        highlightElement.style.height = `${rect.height * scale}px`;
        
        highlightLayer.appendChild(highlightElement);
      });
    });
  
  // Insert the highlight layer after the canvas
  pageCanvas.parentNode?.appendChild(highlightLayer);
};

export const downloadPdfWithHighlights = async (
  pdf: PDFDocumentProxy,
  highlights: Highlight[],
  filename: string
): Promise<void> => {
  try {
    // In a real implementation, this would modify the PDF binary with highlights
    // For demo purposes, we're just creating a blob URL from the existing PDF
    
    // Simulating a delay to represent processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a temporary URL for the file object
    const fileUrl = URL.createObjectURL(new Blob(['PDF data would be here in a real implementation'], 
                                                { type: 'application/pdf' }));
    
    // Create a download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};
