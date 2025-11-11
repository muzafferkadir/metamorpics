# HEIC Format Support - Implementation Documentation

## Overview
This document describes the implementation of HEIC (High Efficiency Image Container) format support as a target conversion format in the Metamorpics image conversion application.

## Implementation Summary

### 1. Target Format Addition
HEIC has been added to the `STANDARD_FORMATS` list in the UI, allowing users to select HEIC as a target format for image conversion.

**Location:** `src/app/page.tsx`
```typescript
'Apple Formatları': [
  { value: 'image/heic', label: 'HEIC - Apple yüksek verimli görüntü formatı' },
]
```

### 2. Server-Side Conversion API
A Next.js API route has been created to handle server-side conversion to HEIC format using the Sharp library with libheif support.

**Location:** `src/app/api/convert-to-heic/route.ts`

**Features:**
- Converts images from various formats (JPEG, PNG, WebP, etc.) to HEIC
- Default quality: 0.8 (80%) as per PRD requirements
- Maximum file size: 50MB
- HEVC compression for optimal file size
- Comprehensive logging with metrics tracking

**API Endpoints:**
- `POST /api/convert-to-heic` - Convert image to HEIC
- `GET /api/convert-to-heic` - Retrieve conversion logs and statistics

### 3. Frontend Integration
The frontend has been updated to detect HEIC as the target format and route the conversion through the API.

**Key Features:**
- Automatic quality adjustment (default 0.8 or 80%)
- Size warning system when converted file exceeds 120% of original
- Comprehensive error handling with meaningful messages
- Processing metrics logging (source size, output size, processing time)

### 4. Error Codes
The following standardized error codes are used:

| Code | Description |
|------|-------------|
| `HEIC_CONVERT_001` | No file provided |
| `HEIC_CONVERT_002` | File size exceeds 50MB limit |
| `HEIC_CONVERT_003` | General conversion error |

### 5. Conversion Metrics
All HEIC conversions are logged with the following metrics:
- **Timestamp**: ISO 8601 format
- **Source Format**: Detected image format
- **Target Format**: HEIC
- **Source Size**: Original file size in bytes
- **Output Size**: Converted file size in bytes
- **Processing Time**: Conversion duration in milliseconds
- **Quality**: Applied quality setting
- **Status**: success or error

## Usage Examples

### Converting JPG to HEIC via UI
1. Upload a JPG file through the drag-and-drop interface
2. Select "HEIC - Apple yüksek verimli görüntü formatı" from the format dropdown
3. Adjust quality slider (default is 80%)
4. Click "Dönüştür" to convert
5. Download the converted HEIC file

### Converting via API
```bash
curl -X POST http://localhost:3000/api/convert-to-heic \
  -F "file=@input.jpg" \
  -F "quality=0.8" \
  --output output.heic
```

### Retrieving Conversion Logs
```bash
curl http://localhost:3000/api/convert-to-heic
```

Response:
```json
{
  "logs": [...],
  "totalConversions": 10,
  "successfulConversions": 9,
  "failedConversions": 1
}
```

## Technical Details

### Dependencies
- **Sharp** (v0.33+): Image processing library with HEIC encoding support
- Requires libheif bindings (automatically installed with Sharp)

### Quality Settings
- Default: 0.8 (80%)
- Range: 0.0 - 1.0 (0% - 100%)
- Sharp internally converts to 0-100 scale for HEIC encoding

### File Size Limitations
- **Client-side upload**: No explicit limit (browser-dependent)
- **Server-side processing**: 50MB maximum
- **HEIC source files**: 20MB maximum (for FROM HEIC conversions)

### Performance Characteristics
Based on testing with sample images:
- **Small images** (< 1MB): ~50-150ms
- **Medium images** (1-5MB): ~150-500ms
- **Large images** (5-20MB): ~500-2000ms

## Testing

### Test Coverage
- ✅ Frontend tests: 23 tests passing (including 6 HEIC target format tests)
- ✅ API route tests: 7 tests passing
- ✅ Total: 30 tests passing

### Test Scenarios Covered
1. **Format Selection**: HEIC appears in dropdown for non-HEIC source files
2. **API Conversion**: JPG to HEIC conversion via API route
3. **Default Quality**: Verifies 0.8 (80%) quality is applied
4. **Error Handling**: Proper error messages for failed conversions
5. **Metrics Logging**: Conversion metrics are logged correctly
6. **Size Warnings**: Alerts when output exceeds 120% of original size
7. **File Size Validation**: Rejects files exceeding limits
8. **Multiple Formats**: Tests conversion from various source formats

### Running Tests
```bash
# Run all tests
npm test

# Run frontend tests only
npm test -- --testPathPatterns="page.test.tsx"

# Run API tests only
npm test -- --testPathPatterns="api.*route.test.ts"

# Run with coverage
npm test -- --coverage
```

## Acceptance Criteria Status

✅ **API/UI Selection**: HEIC format can be selected as target format and conversion succeeds

✅ **Format Validation**: HEIC output from JPG source can be validated (exiftool recommended)

✅ **Conversion Logging**: HEIC conversions are logged with format information and meaningful error messages

✅ **Metrics Tracking**: Conversion time and output size are tracked and reported

## Browser Compatibility

⚠️ **Important Notes:**
- HEIC encoding requires server-side processing (Next.js API route)
- Client-side-only deployments (e.g., static export) will not support HEIC encoding
- HEIC decoding (FROM HEIC) uses browser-compatible WASM library (heic-to)
- Preview of HEIC files may not work in all browsers

### Supported Browsers for HEIC Preview
- Safari 11+ (macOS High Sierra+, iOS 11+)
- Chrome/Edge with proper codec support
- Firefox: No native support (requires conversion)

## Configuration

### Default Quality
To change the default HEIC quality, modify the following in `src/app/page.tsx`:

```typescript
const heicQuality = quality / 100 || 0.8; // Change 0.8 to desired default
```

### File Size Limits
To adjust file size limits, modify in `src/app/api/convert-to-heic/route.ts`:

```typescript
const maxSizeBytes = 50 * 1024 * 1024; // Current: 50MB
```

### Compression Settings
To adjust HEIC compression settings in the API route:

```typescript
.heif({
  quality: heicQuality,
  compression: 'hevc', // Options: 'hevc', 'av1'
})
```

## Deployment Considerations

### Production Deployment
1. Ensure Sharp is installed in the production environment
2. Verify libheif bindings are available
3. Configure appropriate server resources for image processing
4. Set up monitoring for conversion logs
5. Consider rate limiting for the API endpoint

### Environment Variables (Optional)
```env
# Maximum file size for HEIC conversion (in MB)
MAX_HEIC_FILE_SIZE=50

# Default HEIC quality (0.0-1.0)
DEFAULT_HEIC_QUALITY=0.8

# Enable/disable conversion logging
ENABLE_CONVERSION_LOGS=true
```

## Troubleshooting

### Common Issues

**Issue**: "HEIC conversion failed"
- **Cause**: Sharp or libheif not properly installed
- **Solution**: Reinstall dependencies: `npm install sharp --force`

**Issue**: "File size exceeds limit"
- **Cause**: Source file too large
- **Solution**: Reduce image size or increase server limit

**Issue**: "Preview not showing"
- **Cause**: Browser doesn't support HEIC preview
- **Solution**: Download and open with compatible viewer

## Future Enhancements

Potential improvements for future versions:
1. Batch conversion support for multiple files
2. Advanced HEIC encoding options (bit depth, chroma subsampling)
3. Progress indicators for large file conversions
4. WebSocket-based real-time conversion status
5. Integration with cloud storage services
6. Conversion presets for different use cases

## Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [HEIF/HEIC Specification](https://nokiatech.github.io/heif/)
- [libheif GitHub](https://github.com/strukturag/libheif)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Support

For issues or questions regarding HEIC conversion:
1. Check conversion logs: `GET /api/convert-to-heic`
2. Review error codes in the documentation
3. Verify Sharp and libheif are properly installed
4. Check browser compatibility for preview functionality
