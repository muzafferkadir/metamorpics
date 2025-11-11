/**
 * @jest-environment node
 */

import { POST, GET } from '../route';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

// Mock sharp
jest.mock('sharp');

describe('API Route: /api/convert-to-heic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST - Convert to HEIC', () => {
    it('should convert JPEG to HEIC with default quality 0.8', async () => {
      const mockBuffer = Buffer.from('test-image-data');
      const mockHeicBuffer = Buffer.from('heic-image-data');
      
      const mockSharp = {
        metadata: jest.fn().mockResolvedValue({ format: 'jpeg' }),
        heif: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(mockHeicBuffer),
      };

      (sharp as unknown as jest.Mock).mockReturnValue(mockSharp);

      const formData = new FormData();
      const file = new File([mockBuffer], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);
      formData.append('quality', '0.8');

      const request = new NextRequest('http://localhost:3000/api/convert-to-heic', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/heic');
      expect(mockSharp.heif).toHaveBeenCalledWith({
        quality: 80,
        compression: 'hevc',
      });
    });

    it('should return error when no file is provided', async () => {
      const formData = new FormData();
      formData.append('quality', '0.8');

      const request = new NextRequest('http://localhost:3000/api/convert-to-heic', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('No file provided');
      expect(data.code).toBe('HEIC_CONVERT_001');
    });

    it('should reject files larger than 50MB', async () => {
      const largeBuffer = Buffer.alloc(51 * 1024 * 1024); // 51 MB
      
      const mockSharp = {
        metadata: jest.fn().mockResolvedValue({ format: 'jpeg' }),
      };

      (sharp as unknown as jest.Mock).mockReturnValue(mockSharp);

      const formData = new FormData();
      const file = new File([largeBuffer], 'large.jpg', { type: 'image/jpeg' });
      formData.append('file', file);
      formData.append('quality', '0.8');

      const request = new NextRequest('http://localhost:3000/api/convert-to-heic', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('File size exceeds 50MB limit');
      expect(data.code).toBe('HEIC_CONVERT_002');
    });

    it('should handle conversion errors gracefully', async () => {
      const mockBuffer = Buffer.from('test-image-data');
      
      const mockSharp = {
        metadata: jest.fn().mockRejectedValue(new Error('Invalid image format')),
      };

      (sharp as unknown as jest.Mock).mockReturnValue(mockSharp);

      const formData = new FormData();
      const file = new File([mockBuffer], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);
      formData.append('quality', '0.8');

      const request = new NextRequest('http://localhost:3000/api/convert-to-heic', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to convert image to HEIC format');
      expect(data.code).toBe('HEIC_CONVERT_003');
    });

    it('should include processing metrics in response headers', async () => {
      const mockBuffer = Buffer.from('test-image-data');
      const mockHeicBuffer = Buffer.from('heic-image-data');
      
      const mockSharp = {
        metadata: jest.fn().mockResolvedValue({ format: 'png' }),
        heif: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(mockHeicBuffer),
      };

      (sharp as unknown as jest.Mock).mockReturnValue(mockSharp);

      const formData = new FormData();
      const file = new File([mockBuffer], 'test.png', { type: 'image/png' });
      formData.append('file', file);
      formData.append('quality', '0.8');

      const request = new NextRequest('http://localhost:3000/api/convert-to-heic', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      
      expect(response.headers.get('X-Processing-Time')).toBeTruthy();
      expect(response.headers.get('X-Source-Size')).toBeTruthy();
      expect(response.headers.get('X-Output-Size')).toBeTruthy();
    });

    it('should convert with custom quality parameter', async () => {
      const mockBuffer = Buffer.from('test-image-data');
      const mockHeicBuffer = Buffer.from('heic-image-data');
      
      const mockSharp = {
        metadata: jest.fn().mockResolvedValue({ format: 'jpeg' }),
        heif: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(mockHeicBuffer),
      };

      (sharp as unknown as jest.Mock).mockReturnValue(mockSharp);

      const formData = new FormData();
      const file = new File([mockBuffer], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);
      formData.append('quality', '0.95');

      const request = new NextRequest('http://localhost:3000/api/convert-to-heic', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(mockSharp.heif).toHaveBeenCalledWith({
        quality: 95,
        compression: 'hevc',
      });
    });
  });

  describe('GET - Retrieve conversion logs', () => {
    it('should return conversion logs and statistics', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data).toHaveProperty('logs');
      expect(data).toHaveProperty('totalConversions');
      expect(data).toHaveProperty('successfulConversions');
      expect(data).toHaveProperty('failedConversions');
      expect(Array.isArray(data.logs)).toBe(true);
    });
  });
});
