# NXT Class - Frontend

React + TypeScript + Vite frontend application.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- Axios

## Development Setup

### Prerequisites
- Node.js 20+
- npm

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Access at: http://localhost:5173

### Build for Production
```bash
npm run build
```

### Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API service calls
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── config/       # Configuration
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
├── public/           # Static assets
└── package.json      # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Docker

Build and run with Docker:
```bash
docker build -t nxtclass-frontend .
docker run -p 80:80 nxtclass-frontend
```
