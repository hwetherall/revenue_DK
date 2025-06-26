import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import pdf from 'pdf-parse';

const uploadRoutes: FastifyPluginAsync = async (fastify) => {
  // Test route to verify upload routes are registered
  fastify.get('/test', async (_request, _reply) => {
    return { message: 'Upload routes are working!' };
  });

  // Simple test route for multipart
  fastify.post('/test-multipart', async (request, _reply) => {
    try {
      fastify.log.info('Test multipart request received');
      fastify.log.info('Is multipart?', request.isMultipart());
      
      if (request.isMultipart()) {
        const data = await (request as any).file();
        return { 
          success: true, 
          hasFile: !!data,
          filename: data?.filename,
          mimetype: data?.mimetype
        };
      } else {
        return { success: false, error: 'Not multipart' };
      }
    } catch (error) {
      fastify.log.error('Test multipart error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // POST /upload - Handle PDF upload and extract text
  fastify.post('/pdf', async (request: FastifyRequest, reply) => {
    try {
      fastify.log.info('PDF upload request received');
      
      // Ensure we always return JSON, even on errors
      reply.type('application/json');
      
      // Check if request is multipart
      if (!request.isMultipart()) {
        return reply.code(400).send({ 
          error: 'Request must be multipart/form-data',
          success: false 
        });
      }
      
      // Simple approach: just try to get the file directly
      let fileData;
      try {
        fileData = await (request as any).file();
      } catch (fileError) {
        fastify.log.error('Failed to parse multipart data:', fileError);
        return reply.code(400).send({ 
          error: 'Failed to parse uploaded file',
          details: fileError instanceof Error ? fileError.message : 'Unknown file parsing error',
          success: false
        });
      }
      
      if (!fileData) {
        return reply.code(400).send({ 
          error: 'No file uploaded',
          success: false 
        });
      }

      fastify.log.info('File received:', { 
        filename: fileData.filename, 
        mimetype: fileData.mimetype 
      });
      console.log('DEBUG: File received -', fileData.filename, fileData.mimetype);
      console.log('DEBUG: File size from multipart:', fileData.file ? 'has stream' : 'no stream');

      // Check if file is PDF
      if (fileData.mimetype !== 'application/pdf') {
        return reply.code(400).send({ 
          error: 'Only PDF files are allowed',
          received: fileData.mimetype,
          success: false 
        });
      }

      // Convert to buffer using the correct method
      let buffer;
      try {
        // The @fastify/multipart file object has a different API
        const chunks = [];
        for await (const chunk of fileData.file) {
          chunks.push(chunk);
        }
        buffer = Buffer.concat(chunks);
        fastify.log.info('Buffer created, size:', buffer.length);
        console.log('DEBUG: Buffer created, size:', buffer.length, 'first 20 bytes:', buffer.slice(0, 20).toString('hex'));
      } catch (bufferError) {
        fastify.log.error('Failed to convert to buffer:', bufferError);
        return reply.code(500).send({ 
          error: 'Failed to read file data',
          details: bufferError instanceof Error ? bufferError.message : 'Unknown buffer error',
          success: false
        });
      }
      
      // Extract text from PDF
      let pdfData;
      try {
        fastify.log.info('Starting PDF text extraction...');
        const bufferInfo = {
          size: buffer.length,
          firstBytes: buffer.slice(0, 10).toString('hex'),
          isPDFHeader: buffer.slice(0, 4).toString() === '%PDF'
        };
        fastify.log.info('PDF buffer info:', bufferInfo);
        
        // First try with minimal options
        fastify.log.info('Attempting PDF parse...');
        console.log('DEBUG: About to parse PDF, buffer size:', buffer.length, 'isPDF:', buffer.slice(0, 4).toString() === '%PDF');
        pdfData = await pdf(buffer);
        console.log('DEBUG: PDF parsing successful!');
        
        fastify.log.info('PDF processed successfully:', { 
          textLength: pdfData.text.length, 
          pageCount: pdfData.numpages,
          hasText: pdfData.text.trim().length > 0
        });
      } catch (pdfError) {
        const errorInfo = {
          message: pdfError instanceof Error ? pdfError.message : 'Unknown PDF error',
          stack: pdfError instanceof Error ? pdfError.stack : undefined,
          bufferSize: buffer.length,
          isPDFHeader: buffer.slice(0, 4).toString() === '%PDF'
        };
        fastify.log.error('PDF extraction failed with details:', errorInfo);
        console.error('PDF Error Details:', errorInfo); // Also log to console for debugging
        
        return reply.code(500).send({ 
          error: 'Failed to extract text from PDF',
          details: pdfError instanceof Error ? pdfError.message : 'Unknown PDF error',
          bufferInfo: {
            size: buffer.length,
            isPDF: buffer.slice(0, 4).toString() === '%PDF'
          },
          success: false
        });
      }

      let extractedText = pdfData.text;

      // Clean and enhance extracted text for better AI processing
      extractedText = extractedText
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
        .trim();

      // Basic validation - reduced threshold for image-heavy presentations
      if (!extractedText || extractedText.length < 20) {
        return reply.code(400).send({ 
          error: 'PDF appears to be empty or text extraction failed',
          hint: 'This might be an image-only PDF that requires OCR processing',
          success: false
        });
      }

      // Log successful extraction with business context
      const businessKeywords = ['company', 'business', 'revenue', 'market', 'product', 'customer', 'technology'];
      const foundKeywords = businessKeywords.filter(keyword => 
        extractedText.toLowerCase().includes(keyword)
      );
      
      fastify.log.info('Text extraction successful:', {
        textLength: extractedText.length,
        businessKeywords: foundKeywords,
        hasBusinessContent: foundKeywords.length > 0
      });

      return {
        filename: fileData.filename,
        extractedText: extractedText,
        pageCount: pdfData.numpages,
        businessKeywords: foundKeywords,
        success: true
      };

    } catch (error) {
      fastify.log.error('Unexpected PDF upload error:', error);
      return reply.code(500).send({ 
        error: 'Unexpected error processing PDF file',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      });
    }
  });
};

export default uploadRoutes; 