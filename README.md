# StyleSync - Virtual Try-On Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://style-sync-kappa.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![RapidAPI](https://img.shields.io/badge/RapidAPI-Powered-green?style=for-the-badge)](https://rapidapi.com)

> **A modern virtual try-on platform powered by RapidAPI's Try-On Diffusion technology**  
> Built by [Ahmad Saboor](https://github.com/iamahmadsaboor) from Faisalabad, Pakistan

![StyleSync Banner](public/assets/banner.png)

## 🌟 Live Demo

**🚀 [Experience StyleSync Live](https://style-sync-kappa.vercel.app)**

Try the virtual try-on feature: **[Generate Outfit](https://style-sync-kappa.vercel.app/generate-outfit)**

## 📖 Overview

StyleSync is a next-generation virtual try-on platform that allows users to visualize how clothes will look on them before making a purchase. Using RapidAPI's advanced Try-On Diffusion technology, users can upload their photos and clothing items to see realistic virtual fitting results in just 5-10 seconds.

### ✨ Key Features

- **🎯 Virtual Try-On**: Upload your photo and clothing items for instant virtual fitting
- **⚡ Fast Processing**: Results in 5-10 seconds using RapidAPI's diffusion pipeline
- **🖼️ Multiple Input Methods**: Support for image uploads or text descriptions
- **🎨 Background Customization**: Auto or custom background options
- **📱 Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **🌙 Dark/Light Mode**: Toggle between themes
- **💾 Local Storage**: Save and manage your try-on history
- **🔄 Retry Mechanism**: Smart error handling and retry functionality
- **📤 Share & Download**: Export and share your virtual try-on results

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend & API
- **API Integration**: RapidAPI Try-On Diffusion
- **Image Processing**: Client-side file handling
- **State Management**: React Hooks + localStorage

### Deployment & Tools
- **Hosting**: Vercel
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint + TypeScript
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- RapidAPI account and Try-On Diffusion API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamahmadsaboor/Style-Sync.git
   cd Style-Sync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Required: RapidAPI Configuration
   NEXT_PUBLIC_RAPID_API_KEY=your_rapidapi_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional: Analytics & Monitoring
   NEXT_PUBLIC_GOOGLE_ANALYTICS=your_ga_id
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

4. **Get RapidAPI Key**
   - Visit [RapidAPI Try-On Diffusion](https://rapidapi.com/try-on-diffusion/api/try-on-diffusion/)
   - Subscribe to the API (free tier available)
   - Copy your API key to the environment variable

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Project Structure

```
stylesync/
├── app/                    # Next.js 13+ App Router
│   ├── generate-outfit/   # Main virtual try-on page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── sections/         # Page sections (Hero, Gallery, etc.)
│   └── layout/           # Header, Footer components
├── hooks/                # Custom React hooks
│   └── use-virtual-try-on.ts  # Main try-on logic
├── lib/                  # Utility functions
│   ├── client-api.ts     # RapidAPI service
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   └── assets/           # Images and media
└── types/                # TypeScript definitions
```

## 🔧 Configuration

### RapidAPI Setup

1. **Sign up for RapidAPI**
   - Create account at [RapidAPI](https://rapidapi.com)
   - Subscribe to [Try-On Diffusion API](https://rapidapi.com/try-on-diffusion/api/try-on-diffusion/)

2. **Configure Environment**
   ```env
   NEXT_PUBLIC_RAPID_API_KEY=your_rapidapi_key_here
   ```

### Customization Options

```typescript
// lib/constants.ts
export const API_CONFIG = {
  rapidApi: {
    host: "try-on-diffusion.p.rapidapi.com",
    endpoint: "https://try-on-diffusion.p.rapidapi.com/try-on-file",
    timeout: 60000, // 60 seconds
  },
  rateLimit: {
    requests: 100, // per window
    window: 60000, // 1 minute
  },
}
```

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Utilities
npm run clean        # Clean build directories
npm run format       # Format code with Prettier
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Fork this repository**

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your forked repository
   - Configure environment variables:
     - `NEXT_PUBLIC_RAPID_API_KEY`
     - `NEXT_PUBLIC_APP_URL`

3. **Deploy**
   - Vercel will automatically build and deploy
   - Every push to main branch triggers new deployment

### Other Platforms

This app generates static files and can be deployed to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 💡 Usage

1. **Upload Model**: Provide a clear photo of yourself or describe the avatar
2. **Upload Clothing**: Select the garment you want to try on
3. **Customize Background**: Choose automatic or custom background
4. **Generate**: Click "Generate Try-On" and wait 5-10 seconds
5. **Download & Share**: Save your results or share with others

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

**Ahmad Saboor** - Full Stack Developer from Faisalabad, Pakistan

- 🌍 **Location**: Faisalabad, Punjab, Pakistan
- 📧 **Email**: [iamahmadsaboor@gmail.com](mailto:iamahmadsaboor@gmail.com)
- 📱 **Phone**: +92 304 420 755
- 🐙 **GitHub**: [@iamahmadsaboor](https://github.com/iamahmadsaboor)
- 💼 **LinkedIn**: [Ahmad Saboor](https://linkedin.com/in/iamahmadsaboor)

### Skills & Expertise
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Python, API Integration
- **Tools**: Git, Vercel, AWS, Docker
- **Specialties**: Full-stack development, API integration, Modern web applications

## 🙏 Acknowledgments

- **RapidAPI** for providing the Try-On Diffusion API
- **Vercel** for excellent hosting and deployment
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

## 📞 Support

For support or questions:

- 📧 Email: [iamahmadsaboor@gmail.com](mailto:iamahmadsaboor@gmail.com)
- 📱 Phone: +92 304 420 755
- 🐙 GitHub Issues: [Report a bug](https://github.com/iamahmadsaboor/Style-Sync/issues)

---

<div align="center">

**Built with ❤️ by [Ahmad Saboor](https://github.com/iamahmadsaboor) in Faisalabad, Pakistan**

[🌐 Live Demo](https://style-sync-kappa.vercel.app) • [📘 Documentation](https://github.com/iamahmadsaboor/Style-Sync) • [🐛 Report Bug](https://github.com/iamahmadsaboor/Style-Sync/issues)

</div> 