A web-based logo creation and customization tool built with modern web technologies. Create, customize, and download professional logos with an intuitive interface that works seamlessly on both desktop and mobile devices.

## Interface Preview

### Mobile View
<img src="https://github.com/user-attachments/assets/b74796cd-a30f-46f7-aec1-bb11cce02caf" alt="Mobile interface of MyBrande Logo Maker" width="300">

### Desktop View
<img src="https://github.com/user-attachments/assets/e75204e7-5541-4cf1-9a83-8a8a704b8755" alt="Desktop interface of MyBrande Logo Maker" width="600">

## Features

- **Text Customization**
  - Rich text editing with Google Fonts integration
  - Font weight and style controls
  - Letter spacing and curved text effects
  - Text case transformation (uppercase, lowercase, title case)
  - Advanced shadow effects with blur, offset and opacity controls

- **Logo Design**
  - SVG icon library with diverse categories
  - Custom file uploads (SVG support)
  - Advanced layer management system
  - Precise alignment tools with snap guides
  - Scale, rotation and flip controls
  - Multi-object selection and manipulation

- **Color Management**
  - Advanced color picker with RGB/HSL/HEX support
  - Solid and gradient color options
  - Pre-defined color palettes
  - Background color customization with transparency
  - Brand color presets

- **Canvas Features**
  - Real-time preview with zoom
  - Comprehensive undo/redo system
  - Snap-to guides for precise positioning
  - Multi-layer support with visibility controls
  - High-quality PNG/SVG export
  - Auto-save functionality

## Tech Stack

- **Frontend Framework**: Vanilla JavaScript with Vite bundler
- **Canvas Manipulation**: Fabric.js for powerful canvas interactions
- **Color Tools**: iro.js and Alwan for advanced color picking
- **Font Management**: Google Fonts API with WebFontLoader
- **Additional Libraries**:
  - Cropper.js for image manipulation
  - Axios for HTTP requests
  - Toastify for user notifications
  - WebFontLoader for dynamic font loading

## Browser Support

Optimized for modern browsers (Chrome, Firefox, Safari, Edge) with responsive design for both desktop and mobile views. Features like shadow effects, gradients, and SVG manipulation require modern browser capabilities.

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd mybrande_buyer
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm run dev
```

Your logo maker will be available at `http://localhost:3000`

## Building for Production

```bash
pnpm run build
```

The built files will be in the `dist` directory.

## Development

- Uses Vite for fast development and optimized builds
- Modular JavaScript architecture
- Mobile-first responsive design
- Real-time preview updates
- Component-based structure



