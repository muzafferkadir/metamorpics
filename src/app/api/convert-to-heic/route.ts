import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ConversionLog {
  timestamp: string;
  sourceFormat: string;
  targetFormat: string;
  sourceSize: number;
  outputSize: number;
  processingTime: number;
  quality: number;
  status: 'success' | 'error';
  errorMessage?: string;
}

const conversionLogs: ConversionLog[] = [];

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let sourceSize = 0;
  let sourceFormat = 'unknown';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quality = parseFloat(formData.get('quality') as string) || 0.8;

    if (!file) {
      const errorLog: ConversionLog = {
        timestamp: new Date().toISOString(),
        sourceFormat: 'unknown',
        targetFormat: 'image/heic',
        sourceSize: 0,
        outputSize: 0,
        processingTime: Date.now() - startTime,
        quality,
        status: 'error',
        errorMessage: 'HEIC_CONVERT_001: No file provided'
      };
      conversionLogs.push(errorLog);

      return NextResponse.json(
        { error: 'No file provided', code: 'HEIC_CONVERT_001' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    sourceSize = buffer.length;
    
    // Detect source format
    const metadata = await sharp(buffer).metadata();
    sourceFormat = metadata.format || 'unknown';

    // Validate file size (max 50MB for server processing)
    const maxSizeBytes = 50 * 1024 * 1024;
    if (sourceSize > maxSizeBytes) {
      const errorLog: ConversionLog = {
        timestamp: new Date().toISOString(),
        sourceFormat,
        targetFormat: 'image/heic',
        sourceSize,
        outputSize: 0,
        processingTime: Date.now() - startTime,
        quality,
        status: 'error',
        errorMessage: 'HEIC_CONVERT_002: File size exceeds 50MB limit'
      };
      conversionLogs.push(errorLog);

      return NextResponse.json(
        { error: 'File size exceeds 50MB limit', code: 'HEIC_CONVERT_002' },
        { status: 400 }
      );
    }

    // Convert to HEIC with specified quality
    // Sharp uses quality from 0-100 for HEIC
    const heicQuality = Math.round(quality * 100);
    
    const heicBuffer = await sharp(buffer)
      .heif({
        quality: heicQuality,
        compression: 'hevc',
      })
      .toBuffer();

    const outputSize = heicBuffer.length;
    const processingTime = Date.now() - startTime;

    // Log successful conversion
    const successLog: ConversionLog = {
      timestamp: new Date().toISOString(),
      sourceFormat,
      targetFormat: 'image/heic',
      sourceSize,
      outputSize,
      processingTime,
      quality,
      status: 'success'
    };
    conversionLogs.push(successLog);

    // Keep only last 100 logs
    if (conversionLogs.length > 100) {
      conversionLogs.shift();
    }

    // Return the HEIC file
    return new NextResponse(heicBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/heic',
        'Content-Length': heicBuffer.length.toString(),
        'X-Processing-Time': processingTime.toString(),
        'X-Source-Size': sourceSize.toString(),
        'X-Output-Size': outputSize.toString(),
      },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const errorLog: ConversionLog = {
      timestamp: new Date().toISOString(),
      sourceFormat,
      targetFormat: 'image/heic',
      sourceSize,
      outputSize: 0,
      processingTime,
      quality: 0.8,
      status: 'error',
      errorMessage: `HEIC_CONVERT_003: ${errorMessage}`
    };
    conversionLogs.push(errorLog);

    console.error('HEIC conversion error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to convert image to HEIC format', 
        code: 'HEIC_CONVERT_003',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve conversion logs
export async function GET() {
  return NextResponse.json({
    logs: conversionLogs,
    totalConversions: conversionLogs.length,
    successfulConversions: conversionLogs.filter(log => log.status === 'success').length,
    failedConversions: conversionLogs.filter(log => log.status === 'error').length,
  });
}
