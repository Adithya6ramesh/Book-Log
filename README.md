# 📚 Book-Log


> **A modern personal book tracking application built with the Reno Stack**

Book-Log is a full-stack web application that helps you organize and track your personal reading library. Built with modern technologies, it offers a clean interface to manage your books, track reading progress, write reviews, and authenticate securely.
 DEMO VIDEO - https://www.loom.com/share/5f00041cf379407897a1f1de155ba387?sid=08733f29-eff6-4776-9916-a00dfca14bc5
## ✨ Features

- 📖 **Personal Library Management** – Add, edit, and organize your book collection
- � **Reading Progress Tracking** – Mark books as "reading" or "done"
- ⭐ **Rating & Reviews** – Rate books (1-5 stars) and write detailed reviews
- 🔐 **Secure Authentication** – Email/password and Discord OAuth integration
- 🎨 **Modern UI** – Clean, responsive design with Tailwind CSS and Shadcn components
- 🔍 **Smart Filtering** – Filter books by status and sort by various criteria
- 🚀 **Real-time Updates** – Instant UI updates with React Query
- �️ **Type Safety** – End-to-end type safety with TypeScript and Zod validation

## 🛠️ Tech Stack

**Reno Stack Implementation:**
- ⚛️ **Frontend**: React 18 + Vite 7
- 🚦 **Routing**: TanStack Router (file-based)
- 🔗 **Backend**: Hono.js server
- 🔐 **Authentication**: Better-Auth with Discord OAuth
- 🗄️ **Database**: PostgreSQL + Drizzle ORM
- 🎨 **Styling**: Tailwind CSS + Shadcn/ui components
- 📦 **Package Manager**: PNPM with Turborepo monorepo
- 🔄 **State Management**: TanStack React Query
- ✅ **Validation**: Zod schemas (shared between client/server)
- 🐳 **Containerization**: Docker Compose for PostgreSQL

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 22.0.0
- PNPM
- Docker (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adithya6ramesh/Book-Log.git
   cd Book-Log
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```bash
   DATABASE_URL=""
   BETTER_AUTH_SECRET="your-secret-key-here"
   DISCORD_CLIENT_ID="your-discord-client-id"
   DISCORD_CLIENT_SECRET="your-discord-client-secret"
   VITE_SERVER_URL="http://localhost:8080"
   WEB_URL="http://localhost:5173"
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Push database schema**
   ```bash
   pnpm db:push
   ```

6. **Start the development servers**
   ```bash
   pnpm dev
   ```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Database**: PostgreSQL on localhost:5433

## 🔐 Discord OAuth Setup

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Go to OAuth2 settings and add redirect URI:
   ```
   http://localhost:8080/api/auth/callback/discord
   ```
3. Copy Client ID and Client Secret to your `.env` file
4. Enable the following OAuth2 scopes: `identify`, `email`

## 📁 Project Structure

```
Book-Log/
├── apps/
│   ├── server/                 # Hono.js API server
│   │   ├── src/
│   │   │   ├── auth.ts         # Better-Auth configuration
│   │   │   ├── app.ts          # Main server application
│   │   │   ├── index.ts        # Server entry point
│   │   │   ├── db/
│   │   │   │   ├── index.ts    # Database connection
│   │   │   │   ├── schema.ts   # Drizzle schema definitions
│   │   │   │   └── auth-schema.ts # Better-Auth schema
│   │   │   └── routes/
│   │   │       └── books.ts    # Books API endpoints
│   │   └── package.json
│   └── web/                    # React frontend
│       ├── src/
│       │   ├── main.tsx        # App entry point
│       │   ├── components/     # React components
│       │   │   ├── book-list.tsx
│       │   │   ├── create-book-form.tsx
│       │   │   ├── edit-book-modal.tsx
│       │   │   ├── login-form.tsx
│       │   │   └── register-form.tsx
│       │   ├── queries/        # React Query configurations
│       │   │   └── books.queries.ts
│       │   ├── routes/         # TanStack Router routes
│       │   │   ├── __root.tsx
│       │   │   ├── index.tsx
│       │   │   ├── login.tsx
│       │   │   └── register.tsx
│       │   └── utils/
│       │       ├── auth-client.ts
│       │       └── hono-client.ts
│       └── package.json
├── packages/
│   ├── ui/                     # Shared UI components (Shadcn)
│   ├── validators/             # Shared Zod validation schemas
│   ├── tailwind-config/        # Shared Tailwind configuration
│   └── typescript-config/      # Shared TypeScript configurations
├── docker-compose.yml          # PostgreSQL database setup
├── turbo.json                  # Turborepo configuration
└── pnpm-workspace.yaml         # PNPM workspace configuration
```

## 🎯 Core Features

### Book Management
- **Add Books**: Create new book entries with title, author, status, rating, and review
- **Edit Books**: Update any book information inline or via modal
- **Delete Books**: Remove books from your library with confirmation
- **Status Tracking**: Mark books as "reading" or "done"
- **Rating System**: 5-star rating system for completed books
- **Reviews**: Write detailed text reviews for your books

### User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Modern dark theme with Tailwind CSS
- **Smart Filtering**: Filter by reading status (all, reading, done)
- **Flexible Sorting**: Sort by title, author, rating, or date added
- **Real-time Updates**: Instant UI updates without page refreshes

### Authentication
- **Email/Password**: Traditional authentication with secure password handling
- **Discord OAuth**: Social login with Discord integration
- **Session Management**: Persistent sessions with Better-Auth
- **Secure Routes**: Protected API endpoints and client-side route guards

## 🔧 API Endpoints

### Books API (`/books`)
- `GET /books` - Fetch all books
- `GET /books/:id` - Fetch single book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update existing book
- `DELETE /books/:id` - Delete book

### Authentication API (`/api/auth/*`)
- `POST /api/auth/sign-up/email` - Email registration
- `POST /api/auth/sign-in/email` - Email login
- `POST /api/auth/sign-in/social` - Social OAuth login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session
- `GET /api/auth/callback/discord` - Discord OAuth callback

## 🗄️ Database Schema

### Books Table
```sql
books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  status book_status DEFAULT 'reading',
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Authentication Tables
Better-Auth automatically manages user authentication tables:
- `user` - User account information
- `session` - Active user sessions
- `account` - OAuth account linkage
- `verification` - Email verification tokens

## 📝 Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development servers (both frontend and backend) |
| `pnpm build` | Build for production |
| `pnpm db:push` | Push Drizzle schema to database |
| `pnpm db:studio` | Open Drizzle Studio for database management |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm create:route <name>` | Create a new server route |
| `pnpm ui-add <component>` | Add Shadcn UI components |

## 🔒 Security Features

- **Password Validation**: Minimum 6-character requirement
- **Session Security**: HTTP-only cookies with proper SameSite settings
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation with Zod schemas
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### Using Docker
```bash
# Build and start all services
docker-compose up --build

# For production
docker-compose -f docker-compose.prod.yml up --build
```

### Manual Deployment
1. Build the applications:
   ```bash
   pnpm build
   ```

2. Set up production environment variables

3. Start the server:
   ```bash
   pnpm --filter=@repo/server start
   ```

4. Serve the built frontend with your preferred static file server

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests if applicable
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Reno Stack](https://github.com/reno-stack) - Modern full-stack framework
- [Better-Auth](https://www.better-auth.com/) - Simple and secure authentication
- [Hono.js](https://hono.dev/) - Fast, lightweight web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM with excellent DX
- [TanStack Router](https://tanstack.com/router) - Type-safe React routing
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible UI components

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/Adithya6ramesh/Book-Log/issues)
- Check the [Reno Stack Documentation](https://github.com/reno-stack)
- Review component documentation for UI components

---

**Happy Reading! 📚✨**
