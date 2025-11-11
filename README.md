# Metamorpics

## Overview

Metamorpics is a modern, browser-based image format converter that enables users to seamlessly transform their images between various formats including JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, and HEIC. Built with Next.js and React, it provides a beautiful, intuitive interface with drag-and-drop functionality for effortless image conversion.

The application targets photographers, designers, and content creators who need quick, reliable image format conversion without the hassle of installing desktop software. All processing happens client-side in the browser, ensuring privacy and security as images never leave the user's device.

With support for modern web formats like WebP and AVIF, Metamorpics helps users optimize their images for web performance while maintaining quality control through an adjustable quality slider.

## Features

- **Multi-Format Support**: Convert between JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, and HEIC formats
- **HEIC Conversion**: Seamlessly convert Apple's HEIC photos to more widely-supported formats
- **Drag-and-Drop Interface**: Intuitive file upload with drag-and-drop functionality
- **Quality Control**: Adjustable quality slider (0-100%) for fine-tuned compression
- **Real-Time Preview**: View your images before and after conversion
- **Client-Side Processing**: All conversions happen in your browser for maximum privacy
- **Modern UI/UX**: Beautiful gradient design with smooth animations and responsive layout
- **One-Click Download**: Instantly download converted images with proper file extensions

## Tech Stack

- **Framework**: Next.js 14.1.0 (React 18)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3
- **UI Components**: Radix UI (React Slot)
- **Image Processing**:
  - browser-image-compression 2.0.2
  - heic-to 1.1.6
- **File Handling**:
  - react-dropzone 14.2.3
  - file-saver 2.0.5
- **Utilities**: clsx, class-variance-authority
- **Build Tools**: PostCSS, Autoprefixer
- **Linting**: ESLint 8 with Next.js config

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/metamorpics.git
cd metamorpics
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

Build the application for production deployment:

```bash
npm run build
npm start
```

The application will be optimized and ready for deployment.

## Usage

### Basic Image Conversion

1. Open the application in your browser
2. Drag and drop an image file, or click to select one
3. Choose your target format from the dropdown menu
4. Adjust the quality slider to your preference (0-100%)
5. Click "Convert" to process the image
6. Click "Download" to save the converted image

### Programmatic Example

If you want to integrate the image conversion logic into your own project:

```typescript
import imageCompression from 'browser-image-compression';

async function convertImage(file: File, targetFormat: string, quality: number) {
  // Compress the image
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  // Convert to target format
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => resolve(blob),
        targetFormat,
        quality / 100
      );
    };
    img.src = URL.createObjectURL(compressedFile);
  });
}
```

## Testing

Run the linter to check for code quality issues:

```bash
npm run lint
```

The project uses ESLint with Next.js configuration to ensure code quality and consistency. All TypeScript files are checked for type safety during the build process.

To run a production build test:

```bash
npm run build
```

This will verify that all components compile correctly and there are no type errors.

## Project Structure

```
metamorpics/
├── public/              # Static assets (SVG icons)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   └── app/            # Next.js App Router
│       ├── favicon.ico
│       ├── globals.css # Global styles and Tailwind directives
│       ├── layout.tsx  # Root layout component
│       └── page.tsx    # Main application page with conversion logic
├── eslint.config.mjs   # ESLint configuration
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md          # Project documentation
```

## Contributing

We welcome contributions to Metamorpics! To contribute:

1. **Fork the Repository**: Click the "Fork" button on the top right of the repository page
2. **Create a Feature Branch**: Create a new branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Your Changes**: Implement your feature or fix, following the existing code style
4. **Test Your Changes**: Run `npm run lint` and `npm run build` to ensure everything works
5. **Commit Your Changes**: Write clear, descriptive commit messages
   ```bash
   git commit -m "Add: description of your changes"
   ```
6. **Push to Your Fork**: Push your changes to your forked repository
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**: Go to the original repository and create a pull request with a clear description of your changes

Please ensure your code follows the project's ESLint rules and includes appropriate TypeScript types.

## License

This project is currently under development. License information will be determined and added soon. For now, please contact the project maintainers for usage permissions.

TBD
