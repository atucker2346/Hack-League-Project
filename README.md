# Class Action Settlement Assistance App

A TurboTax-style productivity tool that helps users prepare class action settlement claims by auto-filling forms while requiring user review and confirmation at every step. The app never provides legal advice, never auto-submits claims, and always redirects users to official settlement websites for final submission.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Subscription Management**: Free and Premium tier management
- **Settlement Detection**: Browse and detect potential settlements you may qualify for
- **Auto-Fill Assistance**: Automatically suggests form data based on user account and purchase history
- **Field-by-Field Confirmation**: Every auto-filled field requires user approval
- **Mandatory Review Screen**: Complete review of all information before proceeding
- **Legal Compliance**: Disclaimers throughout, no legal advice, no auto-submission

## Tech Stack

- **Frontend**: React 18, React Router, Vite
- **Backend**: Node.js, Express
- **Authentication**: JWT tokens
- **Styling**: CSS Modules

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Running the Application

From the root directory, run:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend dev server (port 3000).

Alternatively, run them separately:

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run dev
```

### Demo Credentials

- Email: `demo@example.com`
- Password: `password`

## Project Structure

```
/
├── server/              # Backend Node.js/Express server
│   ├── routes/         # API route handlers
│   ├── middleware/     # Auth middleware
│   ├── data/           # Mock data
│   └── server.js       # Main server file
├── client/             # React frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/   # React Context providers
│   │   ├── services/  # API service functions
│   │   └── styles/    # CSS files
│   └── vite.config.js
└── package.json        # Root package.json
```

## Key Features Explained

### Auto-Fill with Confirmation
- The app suggests values for form fields based on user data
- Each suggestion requires explicit user acceptance or rejection
- Users can manually enter any value regardless of suggestions

### Review Screen
- All auto-filled data is displayed for review
- Users must confirm three checkboxes:
  1. Information accuracy
  2. Disclaimer acknowledgment
  3. Responsibility acceptance
- Only after all confirmations can users proceed to the official site

### No Auto-Submission
- The app never submits claims automatically
- The "Proceed to Official Claim Site" button opens the official settlement website in a new tab
- Users must complete submission on the official site themselves

### Legal Disclaimers
- Disclaimers appear on every page
- Clear messaging that the app does not provide legal advice
- Users are responsible for verifying all information

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Subscription
- `GET /api/subscription/status` - Get user subscription status
- `GET /api/subscription/tiers` - Get available subscription tiers
- `POST /api/subscription/subscribe` - Update subscription tier

### Settlements
- `GET /api/settlements` - Get all settlements
- `GET /api/settlements/:id` - Get settlement by ID

### Claims
- `POST /api/claims/detect` - Detect user eligibility
- `POST /api/claims/autofill` - Get auto-fill suggestions
- `POST /api/claims/preview` - Preview claim data

## Development Notes

- All data is currently mock data for demonstration
- JWT secret should be changed in production
- Password hashing is simplified for demo purposes
- No actual payment processing is implemented

## License

This is a demonstration project.

