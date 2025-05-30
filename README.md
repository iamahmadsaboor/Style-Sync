# 🎭 StyleSync - AI-Powered Virtual Try-On Platform

> **Transform your fashion experience with cutting-edge AI technology.**

StyleSync is a fully client-side virtual try-on platform that allows users to see how clothing items look on them using advanced AI technology. Built with Next.js, it's optimized for seamless deployment on Vercel with zero backend dependencies.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iamahmadsaboor/Virtual-Try-On)

## ✨ Features

- **🤖 AI-Powered Try-On**: Advanced virtual try-on using RapidAPI
- **📱 Fully Responsive**: Beautiful UI that works on all devices
- **⚡ Client-Side Only**: No backend required - pure static deployment
- **🎨 Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **✨ Smooth Animations**: Enhanced with Framer Motion
- **💾 Browser Storage**: All data saved locally using localStorage
- **🔄 Real-time Processing**: Live progress tracking and cancellation
- **📱 Progressive Enhancement**: Works offline for core features
- **🎯 Type-Safe**: Built with TypeScript for reliability

## 🚀 Quick Start

### One-Click Deploy

Deploy instantly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iamahmadsaboor/Virtual-Try-On)

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamahmadsaboor/Virtual-Try-On.git
   cd Virtual-Try-On
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp env.example .env.local
   ```

4. **Configure Environment Variables**
   ```env
   # Required: RapidAPI Configuration
   NEXT_PUBLIC_RAPID_API_KEY=your_rapidapi_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional: Analytics & Monitoring
   NEXT_PUBLIC_GOOGLE_ANALYTICS=your_ga_id
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 13+ (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Hooks + localStorage
- **API**: RapidAPI Try-On Diffusion
- **Deployment**: Vercel (Static Hosting)

### Project Structure

```
stylesync/
├── app/                    # Next.js 13+ App Router
│   ├── generate-outfit/   # Main virtual try-on page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── sections/         # Page sections
├── hooks/                # Custom React hooks
│   └── use-virtual-try-on.ts  # Main try-on logic
├── lib/                  # Utility functions
│   ├── client-api.ts     # Client-side API service
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── types/                # TypeScript definitions
```

### Client-Side Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Application                      │
├─────────────────────────────────────────────────────────────┤
│  React Components (UI Layer)                               │
│  ├── FileUpload ├── ProgressBar ├── ResultDisplay         │
├─────────────────────────────────────────────────────────────┤
│  Custom Hooks (State Management)                           │
│  ├── useVirtualTryOn ├── localStorage ├── Validation      │
├─────────────────────────────────────────────────────────────┤
│  Client API Service (Network Layer)                        │
│  ├── Rate Limiting ├── Error Handling ├── File Processing │
├─────────────────────────────────────────────────────────────┤
│  External API (RapidAPI)                                   │
│  └── Try-On Diffusion API                                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### RapidAPI Setup

1. **Get API Key**
   - Visit [RapidAPI Try-On Diffusion](https://rapidapi.com/try-on-diffusion/api/try-on-diffusion/)
   - Subscribe to the API
   - Copy your API key

2. **Add to Environment**
   ```env
   NEXT_PUBLIC_RAPID_API_KEY=your_rapidapi_key_here
   ```

### Feature Flags

Control application features via environment variables:

```env
# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA_MEASUREMENT_ID
NEXT_PUBLIC_HOTJAR_ID=HOTJAR_SITE_ID

# Error Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_RATE_LIMIT_REQUESTS=100
NEXT_PUBLIC_RATE_LIMIT_WINDOW=60000
```

## 📦 Deployment

### Vercel (Recommended)

1. **One-Click Deploy**
   - Click the "Deploy with Vercel" button above
   - Connect your GitHub account
   - Configure environment variables

2. **Manual Deploy**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Environment Variables in Vercel**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add environment variables:
     - `NEXT_PUBLIC_RAPID_API_KEY`
     - `NEXT_PUBLIC_APP_URL` (your domain)

### Other Platforms

The app generates static files and can be deployed anywhere:

```bash
# Build for production
npm run build

# Output directory: ./out
# Deploy the 'out' folder to any static hosting provider
```

**Supported Platforms:**
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh

## 🎨 Customization

### Themes

The app supports dark/light mode and can be customized via Tailwind CSS:

```css
/* globals.css */
:root {
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  /* ... customize colors */
}
```

### Animation Variants

Modify animations in `lib/constants.ts`:

```typescript
export const ANIMATION_VARIANTS = {
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  // ... add custom animations
}
```

### API Configuration

Adjust API settings in `lib/constants.ts`:

```typescript
export const API_CONFIG = {
  rapidApi: {
    host: "try-on-diffusion.p.rapidapi.com",
    endpoint: "https://try-on-diffusion.p.rapidapi.com/try-on-file",
    timeout: 60000,
  },
  rateLimit: {
    requests: 100, // per window
    window: 60000, // 1 minute
  },
}
```

## 📱 Usage

1. **Upload Model Image** or **Describe Avatar**
   - Provide a clear photo or description of the model

2. **Upload Clothing Item**
   - Select the garment you want to try on

3. **Customize Background** (Optional)
   - Upload image or describe the setting

4. **Advanced Settings** (Optional)
   - Set seed for reproducible results

5. **Generate Try-On**
   - Click "Generate Try-On" and wait for results

6. **Download & Share**
   - Save results locally or share with others

## 🔒 Privacy & Security

- **No Data Collection**: All processing happens client-side
- **Local Storage**: Images and history stored in browser only
- **Secure API**: Direct HTTPS connection to RapidAPI
- **No User Tracking**: Privacy-first design

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing code style
- Add proper error handling
- Include responsive design
- Test on multiple devices

## 🐛 Troubleshooting

### Common Issues

**API Key Not Working**
- Verify your RapidAPI subscription is active
- Check the API key in environment variables
- Ensure the key starts with `NEXT_PUBLIC_`

**Build Failures**
- Run `npm run type-check` to catch TypeScript errors
- Check for missing environment variables
- Ensure all dependencies are installed

**Deployment Issues**
- Verify `next.config.js` has `output: 'export'`
- Check that all paths are relative
- Ensure environment variables are set in deployment platform

### Performance Optimization

- Images are automatically compressed before upload
- Blob URLs are cleaned up to prevent memory leaks
- Rate limiting prevents API abuse
- Progressive enhancement for offline scenarios

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RapidAPI](https://rapidapi.com/) for the Try-On Diffusion API
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Framer Motion](https://framer.com/motion/) for smooth animations
- [Next.js](https://nextjs.org/) for the amazing framework

---

**Built with ❤️ by [Ahmad Saboor](https://github.com/iamahmadsaboor)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iamahmadsaboor/Virtual-Try-On) 