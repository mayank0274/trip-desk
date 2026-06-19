# Trip Desk Assignment

## Tech Stack
- Next.js
- Supabase (PostgreSQL db, Supabase Auth)
- TypeScript

## Features Built
- Public enquiry page reading live trips.
- Enquiry form that saves to Supabase with validation.
- Authenticated admin with a real login.
- Lead list with search, owner ans status filter.
- Lead detail with status changes and a call log.
- Create and edit trips from admin.
- AI summarization of call logs.
- Deployed live on Vercel, with seed data.

## Technical Decisions
- **API Routes over Server Actions**: We opted for Next.js API routes instead of Server Actions. This provides a clearer boundary between the frontend and backend, leverages a more familiar API structure, and offers the flexibility to easily separate the backend in the future if needed.
- **TanStack React Query**: Used on the client side for data fetching and state management. It provides a robust and easy way to handle caching, retries, and error/loading states.
- **shadcn/ui & Tailwind CSS**: Chosen to ensure consistent theming and enable fast prototyping through reusable, pre-built components and blocks.


## Future Enhancements (With More Time)
1. **Enhance Dashboard:** Add features like bulk status updates, more advanced filters and controls, data exporting, and proper team management.
2. **Improve SEO:** Enhance SEO for trip pages to achieve better visibility and search ranking.
3. **Trip Images & Performance:** Implement image uploads using Supabase Storage for trips, while continuously improving application performance and responsiveness.

## Folder Structure
- **`app/`**: Contains API routes and client-side pages.
- **`components/`**: Reusable and shared UI components.
- **`lib/`**: Utility functions, Zod schemas, AI model configs, and handlers.
- **`supabase/`**: Supabase setups (server, admin, browser) and database migration files.
- **`types/`**: Shared TypeScript types and interfaces.

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mayank0274/trip-desk
   ```
2. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Access the application:**
   The server will run on [http://localhost:3000](http://localhost:3000).
