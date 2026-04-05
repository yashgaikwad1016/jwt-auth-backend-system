# 🚀 Full-Stack Authentication System

## 📌 Overview
This is a complete authentication system with both backend and frontend. The backend is built with Node.js and Express, while the frontend uses React with modern UI design.

## 🛠️ Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer (Email service)

### Frontend
- React.js
- Tailwind CSS
- Axios (HTTP client)
- React Router
- React Hot Toast

## ✨ Features
- User Registration with Email Verification
- Secure Login/Logout
- JWT-based Authentication with Refresh Tokens
- OTP Email Verification
- Protected Routes
- Modern UI with Loading States
- Password Visibility Toggle
- Toast Notifications
- Responsive Design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auth-sys-frontend
   ```

2. **Backend Setup**
   ```bash
   # Install backend dependencies
   npm install

   # Create .env file in root directory
   cp .env.example .env

   # Update .env with your configuration
   # Add MongoDB URI, JWT secrets, email credentials, etc.

   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   # Navigate to client directory
   cd client

   # Install frontend dependencies
   npm install

   # Start frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📂 Project Structure
```
/ (Root - Backend)
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── server.js
├── package.json
└── README.md

/client (Frontend)
├── src/
│   ├── pages/
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── VerifyOTP.jsx
│   │   ├── Dashboard.jsx
│   │   └── Profile.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-email` - Email verification with OTP
- `POST /api/auth/login` - User login
- `GET /api/auth/get-me` - Get current user info
- `GET /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/logout-all` - Logout from all devices

## 🎨 UI Design
- **Primary Color**: Indigo (#4F46E5)
- **Background**: Light Gray (#F9FAFB)
- **Fonts**: Inter, Poppins, Roboto
- **Style**: Clean, Minimal, Professional

## 🔐 Authentication Flow
1. **Register** → Enter username, email, password
2. **Verify Email** → Check email for OTP, enter 6-digit code
3. **Login** → Enter email and password
4. **Access Protected Routes** → Dashboard and Profile pages
5. **Token Management** → Automatic refresh on expiry

## 📱 Pages
- **Register**: User registration form
- **Verify OTP**: Email verification with OTP input
- **Login**: User login form
- **Dashboard**: Protected page showing user info
- **Profile**: Detailed user profile information

## 🛡️ Security Features
- JWT Access & Refresh Tokens
- HTTP-Only Refresh Token Cookies
- Password Hashing with bcrypt
- Email OTP Verification
- Protected Routes
- Automatic Token Refresh

## 📧 Email Configuration
Configure your email service in the `.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## UI Screenshots
<img width="381" height="351" alt="image" src="https://github.com/user-attachments/assets/32fadff7-b534-4d02-9232-71bb0efde75c" />
<img width="1561" height="985" alt="image" src="https://github.com/user-attachments/assets/c7aa143d-2989-4b05-8f25-1f770e020f07" />
<img width="942" height="934" alt="image" src="https://github.com/user-attachments/assets/a952aa3b-144e-4bda-a7f8-2d5016f83de9" />
<img width="1800" height="896" alt="image" src="https://github.com/user-attachments/assets/dcb753fa-a2a4-414e-9a25-54ca5f3332ec" />


## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License
This project is licensed under the ISC License.
/routes
/models
/middlewares

## ⚙️ Setup Instructions
1. Clone the repo
2. Run: npm install
3. Create .env file
4. Run: npm run dev

## 🔗 API Endpoints
- POST /register
- POST /login
- GET /profile

## 👨‍💻 Author
Yash Gaikwad
