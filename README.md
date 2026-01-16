# E-Learning Platform (EduHub)

An adaptive E-Learning Platform built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js). This platform supports Student and Instructor roles, offering features like course creation, enrollment, progress tracking, quizzes, and detailed analytics.

## Features

- **User Roles**: Separate dashboards for Students and Instructors.
- **Course Management**: Instructors can create courses with modules and lessons.
- **Learning**: Students can enroll in courses, watch lessons, and track progress.
- **Quizzes**: Integrated quiz system with scoring.
- **Analytics**:
  - **Student**: Track study hours, quiz scores, and course performance.
  - **Instructor**: View total enrollments, average scores, and detailed course-wise performance.
- **Authentication**: Secure JWT-based authentication with cookie support.

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Context (Auth)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Database (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prudhvi9100/E--Learning-Platform.git
   cd E-Learning-Platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_ACCESS_SECRET=your_jwt_secret
     NODE_ENV=development
     ```
   - Start the server:
     ```bash
     npm start
     ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Access the App**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
E-Learning-Platform/
├── backend/            # Express.js API Server
│   ├── config/         # DB configuration
│   ├── controllers/    # Route logic
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── frontend/           # Next.js Application
│   ├── app/            # App Router pages
│   ├── components/     # Reusable UI components
│   └── lib/            # Utilities and Context
└── README.md           # Project Documentation
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
