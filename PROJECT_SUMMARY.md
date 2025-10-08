# Project Summary: Puck Editor with Authentication

A full-stack React Router application with authentication and a visual page editor powered by Puck.

## 🏗️ Architecture Overview

### Authentication System
- **User Registration** with email verification
- **Login/Logout** with JWT tokens and HTTP-only cookies
- **Password Reset** flow (forgot password)
- **Email Verification** using Nodemailer and JWT tokens
- **Protected Routes** with server-side authentication checks

### Visual Editor (Puck)
- **8 Professional Components**: Hero, VerticalSpace, Heading, Text, ButtonGroup, Columns, Card, Flex
- **Visual Editing Interface** at `/puck/*` paths
- **Server-Side Rendering** of saved content
- **In-Memory Storage** (ready for database integration)

### Tech Stack
- **Frontend**: React Router v7, Material UI v7, Tailwind CSS
- **Backend**: React Router actions/loaders (server-side)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Email**: Nodemailer
- **Editor**: Puck (@measured/puck)

## 📁 Project Structure

```
app/
├── actions/              # Server-side form actions
│   ├── dashboard.ts      # Logout action
│   ├── login.ts          # Login action
│   ├── puck.ts           # Save page action
│   ├── register.ts       # Registration action
│   └── verify-email.ts   # Email verification action
│
├── components/
│   ├── dashboard/
│   │   └── DashboardAppBar.tsx    # App bar with menu
│   ├── login/
│   │   ├── EmailField.tsx
│   │   ├── LoginFields.tsx
│   │   ├── LoginForm.tsx          # Main login component
│   │   ├── LoginHeader.tsx
│   │   ├── PasswordField.tsx
│   │   └── loginValidation.ts
│   ├── puck/
│   │   └── PuckRender.tsx         # Render Puck content
│   ├── register/
│   │   ├── ConfirmPasswordField.tsx
│   │   ├── EmailField.tsx
│   │   ├── NameFields.tsx
│   │   ├── PasswordField.tsx
│   │   ├── PasswordStrengthIndicator.tsx
│   │   ├── RegisterForm.tsx       # Main register component
│   │   ├── RegisterHeader.tsx
│   │   ├── RegistrationSuccess.tsx
│   │   └── registerValidation.ts
│   └── verify/
│       └── VerifyEmailHandler.tsx
│
├── lib/
│   ├── auth.ts           # Auth utilities (JWT, bcrypt)
│   ├── db.ts             # Prisma client
│   ├── email.ts          # Email sending (Nodemailer)
│   ├── pages.server.ts   # Page data management
│   └── validation.ts     # Zod schemas
│
├── loaders/              # Server-side data loaders
│   ├── dashboard.ts      # Dashboard loader
│   └── puck.ts           # Puck editor loader
│
├── routes/
│   ├── dashboard.tsx     # Protected dashboard
│   ├── forgot-password.tsx
│   ├── home.tsx
│   ├── login.tsx
│   ├── puck.$.tsx        # Puck editor (catch-all)
│   ├── register.tsx
│   ├── reset-password.tsx
│   └── verify-email.tsx
│
├── templates/
│   └── verification-email.html    # Email template
│
├── puck.config.tsx       # Puck component configuration
├── root.tsx              # Root layout
└── routes.ts             # Route configuration

prisma/
└── schema.prisma         # Database schema

.env                      # Environment variables
```

## 🔐 Authentication Flow

### Registration
1. User fills registration form (`/register`)
2. Client-side validation (Zod schema)
3. Server-side action validates and creates user
4. Password hashed with bcrypt (10 rounds)
5. Verification token generated (JWT, 24h expiration)
6. Verification email sent via Nodemailer
7. Token stored in database

### Email Verification
1. User clicks link in email (`/verify-email?token=...`)
2. `VerifyEmailHandler` component auto-submits token
3. Server verifies JWT token
4. Updates user's `email_verified` status
5. Clears verification token from database

### Login
1. User enters credentials (`/login`)
2. Server validates credentials
3. Password verified with bcrypt
4. JWT auth token generated (7 days)
5. Token stored in HTTP-only cookie
6. Redirects to `/dashboard`

### Protected Routes
1. Loader checks for auth token in cookies
2. Verifies JWT token
3. Fetches user data from database
4. Returns user data or redirects to `/login`

## 🎨 Puck Editor System

### Component Configuration (`puck.config.tsx`)

#### Available Components:
1. **Hero**: Large header sections with gradient backgrounds
2. **VerticalSpace**: Spacing control (16-96px)
3. **Heading**: Flexible headings (XL-5XL) with alignment
4. **Text**: Body text with size/color/alignment options
5. **ButtonGroup**: Multiple buttons with array fields
6. **Columns**: Responsive multi-column layouts
7. **Card**: Feature cards with icons
8. **Flex**: Auto-responsive grid layouts

### Editing Flow
1. Navigate to `/puck/dashboard` (or any path)
2. Loader fetches existing page data
3. Puck editor renders with drag-and-drop interface
4. User edits content, adds/removes components
5. Click "Publish" → saves via action
6. Redirects to rendered page

### Rendering Flow
1. User visits `/dashboard`
2. Loader fetches page data from `pages.server.ts`
3. `PuckRender` component renders saved content
4. "Edit Page" button links to `/puck/dashboard`

## 🗄️ Database Schema

```prisma
model User {
  id                      Int       @id @default(autoincrement())
  email                   String    @unique
  password_hash           String
  first_name              String
  last_name               String
  email_verified          Boolean   @default(false)
  verification_token      String?
  verification_expires_at DateTime?
  created_at              DateTime  @default(now())
  updated_at              DateTime  @updatedAt
}
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:25432/puke?schema=public"

# JWT Secrets
JWT_SECRET="dev-secret-key-12345"
JWT_VERIFICATION_SECRET="dev-verification-secret-67890"

# Email (Optional for dev)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"

# App
APP_URL="http://localhost:5173"
```

## 🚀 Getting Started

### Prerequisites
```bash
# Install dependencies
npm install

# Start PostgreSQL (Docker)
docker run --name puck-postgres -e POSTGRES_PASSWORD=password -p 25432:5432 -d postgres

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Development
```bash
# Start dev server
npm run dev

# Start type generation watcher (optional)
npm run dev:typegen
```

### Access Points
- **App**: http://localhost:5173
- **Register**: http://localhost:5173/register
- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard (protected)
- **Puck Editor**: http://localhost:5173/puck/dashboard (edit mode)

## 📝 Key Features

### ✅ Implemented
- [x] User registration with validation
- [x] Email verification (JWT tokens)
- [x] Login/Logout with secure cookies
- [x] Password hashing (bcrypt)
- [x] Protected routes with server-side auth
- [x] Visual page editor (Puck)
- [x] 8 professional components
- [x] Component-based architecture
- [x] Server-side actions/loaders
- [x] Responsive design (Tailwind CSS)
- [x] Material UI integration
- [x] Type safety (TypeScript)

### 🔄 Ready for Enhancement
- [ ] Database storage for pages (currently in-memory)
- [ ] Forgot password implementation
- [ ] User profile page
- [ ] Settings page
- [ ] More Puck components
- [ ] Image upload for Puck
- [ ] Page templates
- [ ] Multi-user support with permissions

## 🔒 Security Features

1. **Password Security**
   - bcrypt hashing (10 salt rounds)
   - No plain text storage
   - Strong password requirements

2. **Token Security**
   - JWT for auth tokens (7 day expiry)
   - JWT for verification tokens (24h expiry)
   - HTTP-only cookies
   - Single-use verification tokens

3. **Email Verification**
   - Required for account activation
   - Time-limited tokens
   - Secure token storage

4. **Protected Routes**
   - Server-side authentication checks
   - Automatic redirect to login
   - User data validation

## 📚 Documentation Files

- `PUCK_README.md` - Detailed Puck editor documentation
- `PROJECT_SUMMARY.md` - This file

## 🎯 Development Patterns

### Component Structure
- Separate files for each component
- Validation logic in dedicated files
- Proper TypeScript typing
- Material UI + Tailwind CSS styling

### Route Structure
- Actions in `app/actions/`
- Loaders in `app/loaders/`
- Direct re-exports in route files
- Consistent naming convention

### State Management
- Server-side state via loaders
- Form state with React hooks
- No global state management needed

### Error Handling
- Client-side validation (Zod)
- Server-side validation (Zod)
- User-friendly error messages
- Console logging for debugging

## 🛠️ Common Tasks

### Add a New Puck Component
1. Edit `app/puck.config.tsx`
2. Add to `UserConfig` type
3. Add to `config.components`
4. Define fields, defaultProps, render

### Add a New Route
1. Create route file in `app/routes/`
2. Create loader in `app/loaders/` (if needed)
3. Create action in `app/actions/` (if needed)
4. Add to `app/routes.ts`

### Add Database Model
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Run `npx prisma generate`
4. Use in actions/loaders

## 📊 Performance Considerations

- Server-side rendering for initial load
- Optimistic UI updates where applicable
- Lazy loading components (can be added)
- Image optimization (to be implemented)
- Caching strategies (to be implemented)

---

**Built with ❤️ using React Router, Puck, and modern web technologies**

