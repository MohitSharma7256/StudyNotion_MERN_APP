# StudyNotion – Documentation Notes

> Interview-ready reference that covers the overall architecture, feature set,
> and core workflows for both backend and frontend portions of StudyNotion.

---

## 1. Project Overview
- **Type**: MERN-stack e-learning platform
- **Users**: Students, Instructors, Admins
- **Highlights**
  - Course catalog with filtering + detailed course pages
  - Authenticated dashboards per role (profile, cart, enrolled courses, instructor tooling)
  - Admin review center for approving instructors and managing users
  - Secure checkout flow with Razorpay (or mocked equivalent)
  - Rich content management (sections, subsections, media uploads) and progress tracking

---

## 2. Directory Structure (high level)

```
StudyNotion/
├── Server/                # Express backend
│   ├── config/            # DB + cloud uploads + payments
│   ├── controllers/       # Business logic per domain (auth, courses, etc.)
│   ├── middlewares/       # Auth/JWT guards
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Versioned API routers
│   └── utils/             # Shared helpers (mail, uploads, formatting)
└── src/                   # React frontend
    ├── components/        # UI building blocks
    ├── pages/             # Route-level screens
    ├── services/          # API connectors + operations
    ├── slices/            # Redux state
    └── utils/             # Constants and helpers
```

---

## 3. Backend Deep Dive

### 3.1 Models
- `User`: Accounts with role (`Student`, `Instructor`, `Admin`), avatar, course enrollment, approval flag for instructors, and polymorphic profile reference.
- `Profile`: Supplemental info like contact number, DOB, gender, and bio.
- `Course`: Owner instructor, pricing, curriculum (sections/subsections), metadata such as tags, benefits, learning outcomes, and publication status.
- `Section`/`SubSection`: Nested curriculum layers with video metadata, duration, etc.
- `CourseProgress`: Tracks lecture completion per user per course.
- `Category`: Catalog taxonomy.
- `RatingAndReview`: User feedback per course.
- `OTP`: Temporary signup OTPs.

Each schema uses Mongoose hooks where needed (e.g., course slug, timestamps) and references other collections for population.

### 3.2 Controllers
- **Auth**: OTP issuance, signup (with admin secret guard, instructor approval flag), login (JWT), change password.
- **Profile**: Update/delete account, fetch user details, enrolled courses, instructor dashboard stats, update display picture.
- **Course**: CRUD for courses, sections, subsections, and rating utilities.
- **Payments**: Razorpay handshake, verification, and notifications.
- **ResetPassword**: Token generation + password reset flow.
- **Admin**: Pending instructors list, user directory, approve/reject instructors.
- **Categories / RatingAndReview / CourseProgress**: Supporting operations for their respective domains.

### 3.3 Routes
- `/api/v1/auth`: Public auth endpoints (send OTP, signup, login, password reset).
- `/api/v1/profile`: Protected user endpoints (profile updates, enrolled courses, instructor dashboard).
- `/api/v1/course`: Course CRUD, catalog data, ratings.
- `/api/v1/payment`: Checkout + verification.
- `/api/v1/admin`: Admin-only moderation endpoints.

Routes compose the relevant middlewares: `auth`, `isStudent`, `isInstructor`, `isAdmin`.

### 3.4 Middleware & Utilities
- `auth`: Validates JWT from headers/cookies and attaches `req.user`.
- Role guards: Early exit if accountType mismatch.
- `config` folder handles Mongo connection, Cloudinary uploads, and Razorpay instance.
- `utils` contains mail delivery, file upload helpers, and formatting conversions.

---

## 4. Frontend Overview (preview)

> Detailed per-component documentation will be captured after backend coverage.

- Global state via Redux slices (`auth`, `profile`, `cart`, etc.).
- `services/operations` encapsulate API calls and dispatch pattern.
- `components/core` contains major feature modules (Auth, Dashboard, Course flow, etc.).
- `PrivateRoute` and role-specific gating (students vs instructors vs admin).
- Admin dashboard surfaces pending instructor queue and full user list.

### 4.1 Component Topology
- `src/App.js`: Central router; wires up public pages, auth flows, dashboard shells, and guarded routes.
- `components/common`: Shared UI atoms (Navbar, Footer, Tab, ConfirmationModal, etc.).
- `components/core/Auth`: Login/Signup forms, OTP verification, route wrappers.
- `components/core/Dashboard`: Role-specific dashboards (Cart, EnrolledCourses, Instructor builder, Settings).
- `components/core/ViewCourse`: In-player layout with video sidebar and review modal.
- `components/core/Admin`: Admin dashboard tiles plus moderation tables.

### 4.2 State & Data Flow
- Redux slices persist auth tokens, user profile, cart contents, course edit state, and viewer progress.
- `services/apiconnector` centralizes Axios configuration; `services/operations/*` contain thunk-like helpers coordinating API calls + toasts + navigation.
- `utils/constants` exposes shared enums such as `ACCOUNT_TYPE`.
- Protected routes rely on `PrivateRoute`, `OpenRoute`, and `user?.accountType` checks; instructors are rerouted to `PendingApproval` until approved.

### 4.3 Styling
- Tailwind-style utility classes dominate components, with selective CSS modules (e.g., `loader.css`, Contact form CSS).
- Video/course pages use flex layouts to host sidebar + content panes.

---

## 5. Feature Matrix

| Feature | Backend Support | Frontend Surface |
|---------|----------------|------------------|
| User signup/login | Auth controller | Login/Signup pages + Verify OTP |
| Instructor approval flow | Admin controller, `approved` flag | Pending Approval page, admin queue |
| Course creation & editing | Course controller | Instructor dashboard (Add/Edit/My Courses) |
| Section/Subsection mgmt | Section/SubSection controllers | Instructor course builder UI |
| Student enrollment | Payment controller + Course model updates | Checkout flow + Enrolled courses |
| Course progress | courseProgress controller + model | ViewCourse player tracking |
| Ratings/Reviews | RatingAndReview controller | Course details page |
| Profile editing | Profile controller | My Profile & Settings pages |

---

## 6. Setup & Running Notes

1. **Environment variables**: Mongo URI, JWT secret, Cloudinary keys, Razorpay keys, `ADMIN_CREATION_SECRET`, etc.
2. **Server**: `cd Server && npm install && npm run dev`
3. **Client**: `cd .. && npm install && npm start` (needs `REACT_APP_BASE_URL` pointing to backend)
4. **Admin bootstrap**: Manually insert first admin in DB or sign up with the secret.

---

## 7. Code Documentation Status

### ✅ Backend Documentation (Complete)
All backend files now include comprehensive inline comments:

- **Models** (`Server/models/`): Every schema has header documentation explaining purpose, key fields, relationships, and business rules
- **Controllers** (`Server/controllers/`): Each controller function includes:
  - Purpose and workflow description
  - Parameter validation logic
  - Error handling approach
  - Response structure notes
- **Routes** (`Server/routes/`): Route definitions include:
  - Endpoint purpose
  - Middleware chain explanation
  - Role-based access notes

### ✅ Frontend Documentation (Complete)
Key frontend components now include detailed comments:

- **Core Routing** (`src/App.js`, `PrivateRoute.jsx`): Route structure, role-based gating, and navigation flow
- **Dashboard Components** (`Dashboard.js`, `Sidebar.js`, `SidebarLink.js`): Layout structure and navigation logic
- **Course Builder** (`Add Course/index.js`, `RenderSteps.js`): Multi-step form workflow
- **Video Player** (`VideoDetails.jsx`): Video playback, completion tracking, and navigation
- **Redux Slices** (`authSlice.js`, `courseSlice.js`): State management patterns and data flow
- **API Services** (`apis.js`, `adminAPI.js`): Endpoint definitions and service layer patterns
- **Common Components** (`Navbar.js`, `PendingApproval.jsx`): Shared UI components

### 📝 Documentation Style
- **File-level headers**: Explain component/schema purpose and key responsibilities
- **Function-level comments**: Describe logic flow, edge cases, and important decisions
- **Inline comments**: Clarify complex operations, data transformations, and business rules
- **JSDoc-style blocks**: Used for major functions and components

### 🎯 Interview Readiness
With this documentation, you can confidently:
- Explain the architecture and design decisions
- Walk through specific features end-to-end
- Discuss state management patterns
- Describe API structure and authentication flow
- Answer questions about role-based access control
- Explain the course creation and viewing workflows

---

## 8. Next Steps (Optional Enhancements)
- Add architectural diagrams for complex flows (payment, course publishing)
- Create sequence diagrams for multi-step processes
- Document testing strategies and coverage
- Add deployment and CI/CD notes

---

_Maintained by: Mohit Sharma (customize before interviews)_.






# StudyNotion Ed-Tech Platform

StudyNotion is a versatile and intuitive ed-tech platform that enables users to create, consume, and rate educational content. It provides a seamless and interactive learning experience for students while offering a platform for instructors to showcase their expertise and connect with learners worldwide. The platform is built using the MERN stack, which includes ReactJS, NodeJS, MongoDB, and ExpressJS.

## Table of Contents

- [System Architecture](#system-architecture)
- [Front-end](#front-end)
- [Back-end](#back-end)
- [API Design](#api-design)
- [Deployment](#deployment)

---

## System Architecture

The StudyNotion ed-tech platform follows a client-server architecture with the following main components:

- **Front-end**: Built with ReactJS, it communicates with the back end using RESTful API calls.
- **Back-end**: Developed with NodeJS and ExpressJS, it handles user authentication, course management, and more.
- **Database**: Utilizes MongoDB as a NoSQL database to store course content, user data, and other relevant information.

![System Architecture Diagram]()

---

## Front-end

The front end of StudyNotion is built with ReactJS, offering a dynamic and responsive user interface for students and instructors. Here are some key pages and functionalities:

**For Students:**

- **Homepage**: Introduction to the platform.
- **Course List**: List of available courses with descriptions and ratings.
- **Wishlist**: Display added courses.
- **Cart Checkout**: Complete course purchase using Razorpay.
- **Course Content**: Access course material, including videos.
- **Enrolled Courses**: Progress and list of enrolled courses.
- **User Details**: Account information.
- **User Edit Details**: Edit account information.

**For Instructors:**

- **Dashboard**: Overview of instructor's courses and ratings.
- **Insights**: Detailed course including the number of views, clicks, and other relevant metrics.
- **Course Management Pages**: Create, update, delete courses.
- **View and Edit Profile Details**: Account management.

Front-end tools and technologies include ReactJS, CSS, Tailwind CSS, Redux for state management, and VSCode for development.
Additionally, we use some npm packages to add extra functionality to the front end.

[View Live Demo](https://study-notion-mega-project-frontend.vercel.app/)
![studynotion1](https://github.com/yashsarode45/StudyNotion-Mega-Project/assets/65209607/ad992ea3-e257-404a-9d40-83183f7edfd3)
![studynotion2](https://github.com/yashsarode45/StudyNotion-Mega-Project/assets/65209607/87089177-e065-4b8a-8515-3af8e3aed4db)


---

## Back-end

The back end of StudyNotion is built with NodeJS and ExpressJS and uses MongoDB as its primary database. Key features and functionalities include:

- **User Authentication and Authorization**: Secure login, OTP verification, and forgot password functionality.
- **Course Management**: Instructors can create, update, delete courses, and students can view and rate them.
- **Payment Integration**: Razorpay integration for course purchases.
- **Cloud-based Media Management**: Cloudinary for storing and managing media content.
- **Markdown Formatting**: Course content is stored in Markdown format for rendering.

**Frameworks, libraries, and tools used**: Node.js, MongoDB, Express.js, JWT for authentication and authorization, Bcrypt for password hashing, and Mongoose for database interaction.

### Data Models and Database Schema

- **Student Schema**: Includes name, email, password, and course details.
- **Instructor Schema**: Includes name, email, password, and course details.
- **Course Schema**: Includes course name, description, instructor details, and media content.

---

## API Design

StudyNotion's API follows the REST architectural style, implemented using Node.js and Express.js. It uses JSON for data exchange and standard HTTP request methods. Sample API endpoints include:

- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Log in and generate a JWT token.
- `POST /api/auth/verify-otp`: Verify OTP sent to the user's email.
- `POST /api/auth/forgot-password`: Send a password reset link.
- `GET /api/courses`: Get a list of all available courses.
- `GET /api/courses/:id`: Get details of a specific course.
- `POST /api/courses`: Create a new course.
- `PUT /api/courses/:id`: Update an existing course.
- `DELETE /api/courses/:id`: Delete a course.
- `POST /api/courses/:id/rate`: Add a course rating (out of 5).

Sample API requests and responses:
- `GET /api/courses`: Get all courses
- Response: A list of all courses in the database
- `GET /api/courses/:id`: Get a single course by ID
- Response: The course with the specified ID
- `POST /api/courses`: Create a new course
- Request: The course details in the request body
- Response: The newly created course
- `PUT /api/courses/:id`: Update an existing course by ID
- Request: The updated course details in the request body
- Response: The updated course
- `DELETE /api/courses/:id`: Delete a course by ID
- Response: A success message indicating that the course has been deleted.

---

## Deployment

StudyNotion is deployed on various cloud-based services:

- Front-end: Vercel for static site hosting.
- Back-end: Render or Railway for Node.js and MongoDB hosting.
- Media Files: Cloudinary for media content storage.
- Database: MongoDB Atlas for database hosting.

This infrastructure ensures scalability, security, and reliability.

---

Thank you for using StudyNotion!


