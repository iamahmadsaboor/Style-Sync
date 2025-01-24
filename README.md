# Virtual Cloth Try-On AI

An AI-powered virtual try-on application that allows users to visualize how clothing items would look on their photos. Built with Next.js and integrated with the OOTDiffusion model.

## Features

- Virtual try-on functionality for clothing items
- Support for different clothing categories
- Customizable generation parameters
- Real-time image processing
- Error handling and retry mechanisms

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js API Routes
- **AI Model**: OOTDiffusion via Gradio Client
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/virtual-cloth-try-on-ai.git
cd virtual-cloth-try-on-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Hugging Face token:
```env
HUGGING_FACE_TOKEN=your_token_here
```

## Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

The application is configured for deployment on Vercel. Important notes:

- The serverless function timeout is set to 60 seconds (Vercel hobby plan limitation)
- Ensure all environment variables are properly set in your Vercel project settings

To deploy:

```bash
vercel --prod
```

## Usage Limitations

- Maximum processing time: 60 seconds per request
- Image size and format requirements: [Add specific requirements]
- API rate limits: [Add rate limit details]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

- Ali Hamza Kamboh ([@ahkamboh](https://github.com/ahkamboh))

## License

MIT License


## Hugging Face Model

- OOTDiffusion model by [ahkamboh](https://huggingface.co/spaces/ahkamboh/Change-cloth-AI)

- Next.js framework by Vercel
