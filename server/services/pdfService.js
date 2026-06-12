import pdfParse from 'pdf-parse/lib/pdf-parse.js';

/**
 * Extract text from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    const text = data.text
      .replace(/\n{3,}/g, '\n\n')  // Collapse multiple newlines
      .replace(/\s{3,}/g, ' ')      // Collapse multiple spaces
      .trim();

    if (!text || text.length < 50) {
      throw new Error('PDF appears to be empty or contains no extractable text. Please ensure the PDF is not a scanned image.');
    }

    return text;
  } catch (error) {
    if (error.message.includes('empty') || error.message.includes('extractable')) {
      throw error;
    }
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Extract metadata from PDF buffer
 * @param {Buffer} buffer
 * @returns {Promise<Object>} 
 */
export const extractPDFMetadata = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return {
      numPages: data.numpages,
      metadata: data.metadata,
      info: data.info,
    };
  } catch {
    return { numPages: 0, metadata: null, info: null };
  }
};
