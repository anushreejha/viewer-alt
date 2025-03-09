
export interface Highlight {
  id: string;
  pageNumber: number;
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    };
    rects: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    }[];
    pageWidth: number;
    pageHeight: number;
  };
  color: 'yellow' | 'blue' | 'green' | 'pink';
  content: string;
  createdAt: number;
}

export interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  [key: string]: any;
}

export interface PDFPageProxy {
  getTextContent: () => Promise<TextContent>;
  getViewport: (options: { scale: number }) => PDFPageViewport;
  [key: string]: any;
}

export interface PDFPageViewport {
  width: number;
  height: number;
  [key: string]: any;
}

export interface TextContent {
  items: TextItem[];
  [key: string]: any;
}

export interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  [key: string]: any;
}
