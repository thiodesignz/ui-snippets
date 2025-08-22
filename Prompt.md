You are building a web application similar to UI.live where designers can upload, share, and browse UI snippets.  
Use Supabase for backend services (Authentication, PostgreSQL Database, Storage, and Realtime updates).  
Generate a production-ready web app with the following requirements:

---

### Core Features

1. **Authentication**
   - Support Email + Password login
   - Google and GitHub social sign-in
   - Optional magic link login

2. **Snippet Upload**
   - Users can upload UI screenshots (PNG, JPG, SVG)
   - Users can also upload Figma frames by:
     - Pasting a Figma share link
     - Copy/Paste directly into the app
   - Upload form should include:
     - Title
     - Description
     - Tags (array of strings)
     - “Plug URL” (external link to portfolio, product, or profile)
   - Uploaded files stored in Supabase Storage
   - Metadata saved in PostgreSQL

3. **Snippet Gallery**
   - Home page shows a grid of snippets
   - Each snippet card displays:
     - Preview image (or frame)
     - Title, tags
     - Uploader info (name, avatar)
     - Plug URL
   - Clicking a snippet opens a detail page with:
     - Larger preview
     - Full metadata (title, description, tags, plug URL)
     - **Copy button** if snippet is a Figma frame
     - **Download button** if snippet is an uploaded image file

4. **Profiles**
   - Each user has a public profile page with:
     - Display name
     - Avatar
     - Plug URL
     - List of uploaded snippets

5. **Engagement**
   - Track number of views and likes per snippet
   - Display counts on snippet cards and detail pages
   - Update counts in realtime using Supabase subscriptions

6. **Search & Filter**
   - Full-text search across title, description, and tags
   - Tag-based filtering (e.g. Dashboard, Dark UI, Mobile App)

---

### Database Schema (Supabase PostgreSQL)

- **users**
  - id (uuid, PK)
  - name (text)
  - avatar_url (text)
  - plug_url (text)
  - created_at (timestamp, default now())

- **snippets**
  - id (uuid, PK)
  - user_id (uuid, FK → users.id)
  - title (text)
  - description (text)
  - tags (text[])
  - file_url (text, nullable if Figma link is used)
  - figma_url (text, nullable if image is used)
  - plug_url (text)
  - created_at (timestamp, default now())

- **likes**
  - id (uuid, PK)
  - user_id (uuid, FK → users.id)
  - snippet_id (uuid, FK → snippets.id)
  - created_at (timestamp, default now())

- **views**
  - id (uuid, PK)
  - user_id (uuid, FK → users.id, nullable)
  - snippet_id (uuid, FK → snippets.id)
  - created_at (timestamp, default now())

---

### Additional Requirements
- Responsive, modern UI built with **React + TailwindCSS**
- Optimized image handling (thumbnails + full-size views)
- Secure uploads: only authenticated users can upload
- Public browsing: any visitor can explore snippets
- Supabase Realtime subscriptions for:
  - New snippet uploads
  - Live likes/views updates

---

### Deliverables
Generate a full project setup with:
- Supabase Auth
- PostgreSQL schema with Supabase client integration
- Supabase Storage for file uploads
- React frontend with TailwindCSS
