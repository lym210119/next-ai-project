# Next.js AI Content Platform

A full-stack AI-powered content creation and management platform built with **Next.js 16**, **Tailwind CSS v4**, **Drizzle ORM**, **shadcn/ui**, **Supabase**, and **OpenAI**.

## Features

- 📝 **Content Management**: Create, edit, and publish articles
- 🤖 **AI Content Generation**: Generate high-quality articles using OpenAI's GPT models
- 📱 **WeChat Integration**: Sync articles to WeChat Official Accounts
- 📊 **Admin Dashboard**: Comprehensive analytics and management interface
- 🔍 **Search & Filter**: Find articles by category, status, source, and content
- 🏷️ **Tagging System**: Organize content with tags and categories
- 👀 **View Tracking**: Monitor article engagement with view counts
- 💾 **Supabase Database**: PostgreSQL database with real-time capabilities
- ⚡ **Next.js 16**: App Router, Server Components, and Edge Runtime support
- 🎨 **Tailwind CSS v4** & **shadcn/ui** - Modern, accessible UI components
- 🗃️ **Drizzle ORM** - Type-safe SQL querying

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Accessible, customizable UI components
- **Radix UI Primitives** - Unstyled, accessible components

### Backend
- **Supabase** - PostgreSQL database with authentication
- **Drizzle ORM** - Type-safe SQL querying and migrations
- **Next.js API Routes** - Serverless functions for backend logic
- **OpenAI API** - AI content generation service

### Database Schema
- **Users** - User accounts and authentication
- **Articles** - Content storage with metadata
- **AI Tasks** - Track AI generation jobs and results
- **WeChat Articles** - Sync status for WeChat official accounts
- **Sessions & Verification Tokens** - Authentication handling

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account
- OpenAI API key
- PostgreSQL database (Supabase provides this)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/next-ai-project.git
   cd next-ai-project
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase and OpenAI credentials

4. Set up Supabase database
   - Create a new Supabase project
   - Run the database migrations:
     ```bash
     npm run db:migrate
     ```
   - Or use the Supabase dashboard to create tables based on the schema below

5. Run the development server
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  emailVerified TIMESTAMP WITH TIME ZONE,
  image TEXT,
  role VARCHAR(20) DEFAULT 'user' NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Articles Table
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  authorId UUID REFERENCES users(id),
  category VARCHAR(100),
  tags TEXT, -- comma-separated tags
  status VARCHAR(20) DEFAULT 'draft' NOT NULL, -- draft, published, scheduled
  source VARCHAR(10) DEFAULT 'human' NOT NULL, -- human, ai
  viewCount INTEGER DEFAULT 0 NOT NULL,
  publishedAt TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### AI Tasks Table
```sql
CREATE TABLE aiTasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  modelUsed VARCHAR(50) DEFAULT 'gpt-4o' NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, processing, completed, failed
  resultArticleId UUID REFERENCES articles(id),
  errorMessage TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completedAt TIMESTAMP WITH TIME ZONE
);
```

### WeChat Articles Table
```sql
CREATE TABLE wechatArticles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  articleId UUID NOT NULL REFERENCES articles(id),
  wechatMediaId VARCHAR(255),
  wechatUrl VARCHAR(500),
  publishedAt TIMESTAMP WITH TIME ZONE,
  syncStatus VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, synced, failed
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  sessionToken TEXT PRIMARY KEY,
  userId UUID NOT NULL REFERENCES users(id),
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Verification Tokens Table
```sql
CREATE TABLE verificationTokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);
```

## API Endpoints

### Articles
- `GET /api/articles` - List articles with filtering and pagination
- `POST /api/articles` - Create a new article
- `GET /api/articles/[id]` - Get a specific article
- `PUT /api/articles/[id]` - Update an article
- `DELETE /api/articles/[id]` - Delete an article

### AI Tasks
- `GET /api/ai` - List AI tasks with filtering and pagination
- `POST /api/ai` - Create a new AI task (triggers article generation)
- `GET /api/ai/[id]` - Get a specific AI task
- `PUT /api/ai/[id]` - Update an AI task
- `DELETE /api/ai/[id]` - Delete an AI task

### WeChat Integration
- `GET /api/wechat` - List WeChat sync records
- `POST /api/wechat` - Sync an article to WeChat
- `GET /api/wechat/[id]` - Get a specific WeChat record
- `PUT /api/wechat/[id]` - Update a WeChat record
- `DELETE /api/wechat/[id]` - Delete a WeChat record

### Dashboard
- `GET /api/dashboard` - Get statistics for admin dashboard

### Authentication
- `POST /api/auth/callback` - Auth callback (handled by NextAuth)
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `DATABASE_URL` | PostgreSQL connection URL | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL (for auth callbacks) | No |

## Development

### Project Structure
```
next-ai-project/
├── src/                 # Source code
│   ├── app/             # Next.js app router
│   │   ├── (admin)/     # Admin routes (protected)
│   │   ├── api/         # API routes
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utilities and services
│   │   ├── db.ts        # Drizzle database client
│   │   ├── ai.ts        # OpenAI service
│   │   └── utils.ts     # Helper functions
│   ├── types/           # TypeScript type definitions
│   └── styles/          # CSS and Tailwind configuration
├── drizzle/             # Database schema and migrations
│   ├── schema.ts        # Database schema definition
│   └── migrations/      # Generated SQL migrations
├── public/              # Static assets
├── .env.example         # Environment variables template
├── drizzle.config.ts    # Drizzle ORM configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The application can be deployed to any Node.js hosting platform that supports Next.js.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [OpenAI](https://openai.com/) - AI research and deployment company
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible component primitives
- [clsx](https://github.com/lukeed/clsx) - Utility for constructing className strings
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Utility for merging Tailwind CSS classes
- [zod](https://zod.dev/) - TypeScript-first schema validation with static type inference