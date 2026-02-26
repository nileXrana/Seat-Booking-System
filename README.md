# Seat Booking System (MVP)

A minimal, strict daily seat booking system for office employees divided into two batches.

## Features
- **Strict 3 PM Rule**: Booking window opens strictly at 3:00 PM local time.
- **Batch-Based Allocation**:
  - **Batch 1 (B1)**: Mon, Tue, Wed (Guaranteed 40 Designated Seats).
  - **Batch 2 (B2)**: Thu, Fri (Guaranteed 40 Designated Seats).
- **Floating Seats**: 10 floating seats available for non-batch days, bookable strictly 1 working day in advance.
- **Seat Release**: Users can release their designated seat for a day, temporarily converting it into an available floating seat.
- **Simple Auth**: Stateless JWT-based authentication.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** MongoDB (Requires Replica Set)
- **ORM:** Prisma
- **Styling:** Tailwind CSS + custom glassmorphism components
- **Auth:** `jose` (JWT)

## Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb://127.0.0.1:27017/seat-booking"
   JWT_SECRET="your_secret_key"
   ```

3. **Database Configuration**
   Prisma requires MongoDB to be running as a **Replica Set** to perform write operations. Ensure your local `mongod` is configured with a `replSetName`.

4. **Push Schema & Seed**
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Test Credentials
The seeding script generates exactly 80 users (40 per batch).
- **Email format**: `b1@wissen01` to `b1@wissen40` (and similarly for `b2`)
- **Password**: `12345678` for all seeded test accounts.
