# UI Snippets Platform

A web application for designers to share and discover UI snippets, built with Next.js, Supabase, and TailwindCSS.

## Features

- User authentication (Email, Google, GitHub, Magic Link)
- Upload UI screenshots and Figma frames
- Browse and search snippets
- Like and track views
- User profiles
- Realtime updates

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** Supabase (Authentication, Database, Storage, Realtime)
- **Styling:** shadcn/ui components
- **Form Handling:** React Hook Form, Zod
- **State Management:** Server Components + Client Hooks

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and get your credentials

4. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Run the migrations in your Supabase project:
   - Copy the contents of `supabase/migrations/00000000000000_initial_schema.sql`
   - Run it in your Supabase SQL editor

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── upload/            # Snippet upload page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── snippets/         # Snippet-related components
├── lib/                  # Utility functions
│   └── supabase/        # Supabase client & types
└── middleware.ts         # Authentication middleware
```

## Database Schema

- **users:** User profiles with avatars and plug URLs
- **snippets:** UI snippets with metadata
- **likes:** Track snippet likes
- **views:** Track snippet views

## Deployment

1. Create a production Supabase project
2. Deploy to Vercel or your preferred hosting platform
3. Set the environment variables in your hosting platform
