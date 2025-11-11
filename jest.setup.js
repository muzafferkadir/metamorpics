import '@testing-library/jest-dom'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}))

// Mock browser-image-compression
jest.mock('browser-image-compression', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock heic-to
jest.mock('heic-to', () => ({
  heicTo: jest.fn(),
  isHeic: jest.fn(),
}))

// Only set up browser mocks if in a browser-like environment
if (typeof HTMLCanvasElement !== 'undefined') {
  // Mock window.Image
  global.Image = class {
    constructor() {
      setTimeout(() => {
        this.onload && this.onload()
      }, 0)
    }
  }

  // Mock URL.createObjectURL
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
  global.URL.revokeObjectURL = jest.fn()

  // Mock canvas
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    drawImage: jest.fn(),
  }))

  HTMLCanvasElement.prototype.toBlob = jest.fn((callback) => {
    callback(new Blob(['mock'], { type: 'image/jpeg' }))
  })
}
