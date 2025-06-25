# PDF Upload Feature Guide

## Overview
The Business Model Classifier now supports uploading PDF pitch decks to automatically extract company information and run classification analysis.

## How It Works

### 1. Upload Interface
- Switch to "Upload PDF" mode using the tab switcher
- Drag and drop a PDF file or click to browse
- Maximum file size: 10MB
- Only PDF files are accepted

### 2. Text Extraction
- The system automatically extracts text from the PDF
- Shows a preview of the extracted content
- Displays character count and page information

### 3. Classification
- Click "Classify Business Model" to run the analysis
- Uses the filename as the business name
- Uses the extracted text as the business description
- Runs all four classification agents:
  - Customer segments
  - Revenue model
  - Architecture type
  - Product type

## Technical Implementation

### Backend
- **Route**: `POST /upload/pdf`
- **Dependencies**: `@fastify/multipart`, `pdf-parse`
- **File validation**: MIME type and size checks
- **Text extraction**: Uses pdf-parse library

### Frontend
- **Component**: `FileUpload.tsx`
- **Features**: Drag-and-drop, file validation, progress indication
- **Integration**: Seamless with existing classification workflow

## API Endpoints

### Upload PDF
```
POST /upload/pdf
Content-Type: multipart/form-data

Response:
{
  "filename": "company-pitch.pdf",
  "extractedText": "...",
  "pageCount": 10,
  "success": true
}
```

## Error Handling
- Invalid file types rejected
- File size limits enforced
- Empty PDFs detected
- Network errors handled gracefully
- User-friendly error messages

## Next Steps
This is the foundation for PDF processing. Future enhancements could include:
- Company information extraction (name, industry, etc.)
- Structured data parsing
- Multiple file upload
- PDF preprocessing and cleaning 