# NXT Class - Frontend

React + TypeScript + Vite frontend application for the NXT Class educational platform.

## 🚀 Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **HTTP Client:** Axios

## 📦 Project Structure

```
frontend/
├── src/
│   ├── api/              # API service layer
│   │   └── services/     # API service modules
│   ├── components/       # React components
│   │   ├── dashboards/   # Dashboard components
│   │   └── ui/           # shadcn/ui components
│   ├── config/           # Configuration files
│   ├── data/             # Mock data
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── package.json          # Dependencies and scripts
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

## 🏃 Running the Application

### Development Mode

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

The application will start at `http://localhost:5173`

### Production Build

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

Create `.env.development` and `.env.production` files:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

The application uses JWT token-based authentication:

1. Login at `/login`
2. Token stored in localStorage
3. Automatic token injection via Axios interceptors
4. Auto-redirect to login on 401 responses

### Default Test Accounts

```
Admin:
  Email: admin@nxtclass.com
  Password: Admin@123
  Role: ORGADMIN

Teacher:
  Email: teacher@nxtclass.com
  Password: Admin@123
  Role: TEACHER

Student:
  Email: student@nxtclass.com
  Password: Admin@123
  Role: STUDENT
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) - a collection of re-usable components built with Radix UI and Tailwind CSS.

## 📱 Features

- **Dashboard:** Role-based dashboards (Admin, Teacher, Student)
- **User Management:** CRUD operations for users
- **Course Management:** Create and manage courses
- **Virtual Classroom:** Live video conferencing
- **Assignments:** Assignment creation and submission
- **Announcements:** System-wide announcements
- **Digital Notebook:** Real-time note-taking (Huion integration)
- **Analytics:** Advanced reporting and analytics
- **Settings:** User preferences and configuration

## 🔒 Security Features

- Protected routes with authentication
- Role-based access control (UI level)
- Token-based API authentication
- Automatic token refresh handling
- XSS protection via React

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

Proprietary - NXT Class Educational Platform

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

## 📞 Support

For issues or questions, contact the development team.
