# ElectX

A modern, secure, and visually dynamic mini-election platform built with Next.js and Supabase.

## Key Features
- 🪪 **Smart ID Card Registration**: A fun, dynamic multi-step registration flow that generates a live official "Voter ID" complete with photo and signature uploads.
- 🔐 **JWT Authentication**: Secure login system with HTTP-only cookies, replacing the old passcode approach.
- 👨‍⚖️ **Admin Dashboard**: Full visibility into registered users, verification controls (Approve/Reject/Review), and dynamic search.
- 📊 **Vote Integrity & Insights**: Live election tracking with an immutable audit log. Rejected users immediately have their votes revoked, ensuring 100% accurate results.
- ⏳ **Automated Countdowns**: Automatically unlock the Voting form and Results page at precise, configurable times.
- 🎨 **Modern Aesthetics**: Built heavily on glassmorphism, gradient text, dynamic `framer-motion` animations, and a customized ID card UI.

## Tech Stack
- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Vanilla CSS config
- **Animations:** Framer Motion, React Confetti
- **Backend/DB:** Supabase (PostgreSQL, Row Level Security, Supabase Storage)

## Environment Setup
You must supply the following environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET` (For signing auth cookies)
- `ADMIN_PASSWORD` (For accessing the secure admin panel)
- `NEXT_PUBLIC_VOTING_OPENS_DATE` (ISO 8601 UTC string)
- `NEXT_PUBLIC_RESULTS_UNLOCK_DATE` (ISO 8601 UTC string)# simple-fun-election-repo
