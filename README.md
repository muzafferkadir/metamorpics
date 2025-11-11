# Metamorpics - Image Format Converter

A modern, user-friendly image format converter built with Next.js that supports conversion between multiple image formats including HEIC.

## Features

- 🖼️ **Multiple Format Support**: JPEG, PNG, GIF, WebP, AVIF, HEIC, BMP, TIFF
- 🎯 **HEIC Conversion**: Convert TO and FROM Apple's HEIC format
- 🎨 **Quality Control**: Adjustable quality settings for all conversions
- 📊 **Conversion Metrics**: Track file size, processing time, and conversion logs
- ⚡ **Fast Processing**: Server-side conversion with Sharp library
- 🎭 **Modern UI**: Beautiful, responsive interface with drag-and-drop support
- ⚠️ **Smart Warnings**: Alerts when converted file size increases significantly
- 🔒 **Safe**: Client-side processing for most formats, secure server-side for HEIC

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supported Formats

### Source Formats
- JPEG/JPG
- PNG
- GIF
- WebP
- AVIF
- HEIC/HEIF (up to 20MB)
- BMP
- TIFF

### Target Formats
- JPEG/JPG
- PNG
- GIF
- WebP
- AVIF
- **HEIC** (NEW! - Server-side conversion)
- BMP
- TIFF

## HEIC Support

The application now supports converting images TO HEIC format:

- Default quality: 80% (0.8)
- Maximum file size: 50MB
- Server-side processing with Sharp + libheif
- Comprehensive logging and metrics tracking

For detailed HEIC documentation, see [HEIC_FEATURE_DOCUMENTATION.md](./HEIC_FEATURE_DOCUMENTATION.md)

## API Endpoints

### Convert to HEIC
```bash
POST /api/convert-to-heic
Content-Type: multipart/form-data

Parameters:
- file: Image file to convert
- quality: Quality setting (0.0-1.0, default: 0.8)
```

### Get Conversion Logs
```bash
GET /api/convert-to-heic

Returns:
{
  "logs": [...],
  "totalConversions": number,
  "successfulConversions": number,
  "failedConversions": number
}
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPatterns="page.test.tsx"
```

Current test status: **30/30 tests passing** ✅

## Building for Production

```bash
npm run build
npm start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
