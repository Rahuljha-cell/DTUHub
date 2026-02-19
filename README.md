# DTUHub - Student Community Platform

A full-stack student community platform for Delhi Technological University built with Next.js 14, MongoDB, and Firebase.

## Features

- **Peer-to-Peer Rentals** - List and rent books, electronics, sports gear, and more
- **Study Resources** - Share and access notes, PYQs, assignments, and e-books
- **Mentorship** - Connect with seniors for guidance on academics and placements
- **Real-time Chat** - Firebase-powered instant messaging between students
- **Community Feed** - Share updates, events, and opportunities with tags
- **User Profiles** - Showcase listings, resources, skills, and reviews

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Database | MongoDB Atlas (Mongoose) |
| Auth | NextAuth.js (Google + Credentials) |
| Images | Cloudinary |
| Real-time | Firebase Realtime Database |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |

## Getting Started

### 1. Clone and install

```bash
cd dtu-rent
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

You need:
- **MongoDB Atlas** - Free cluster at [mongodb.com](https://www.mongodb.com/atlas)
- **Google OAuth** - Create credentials at [console.cloud.google.com](https://console.cloud.google.com)
- **Cloudinary** - Free account at [cloudinary.com](https://cloudinary.com)
- **Firebase** - Free project at [console.firebase.google.com](https://console.firebase.google.com) (enable Realtime Database)

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (auth)/          - Login and registration pages
  (main)/          - All authenticated pages (browse, listings, resources, chat, etc.)
  api/             - REST API routes
components/
  ui/              - Reusable UI components (Button, Card, Input, etc.)
  layout/          - Navbar and Footer
  listings/        - Listing card, form, filters
  chat/            - Chat window, list, message bubble
  resources/       - Resource card and upload form
  community/       - Post card and form
lib/               - MongoDB connection, auth config, Cloudinary, Firebase, utilities
models/            - Mongoose schemas (User, Listing, Booking, Resource, etc.)
types/             - TypeScript types and constants
```

## Payment Options

This platform acts purely as a connector. Payment is handled directly between students with three options:
- **Cash on Delivery** - Pay full amount when receiving the item
- **50% Advance** - Pay half upfront, half on delivery
- **100% Advance** - Pay full amount before delivery
