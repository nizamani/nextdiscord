# Next Discord

This is a Discord-like chat application built using **Next.js**, **Redux**, and **Firebase Firestore**.

## Features

- 🌍 **Next.js for server-side rendering and performance optimization**
- ⚡ **State management with Redux** for seamless user experience
- 📝 **Channel-based messaging** with message history
- 🎨 **Responsive UI** with Tailwind CSS
- 🚀 **Upcoming Feature:** Real-time messaging using Pusher

## Live Demo
Check out the live demo on Vercel:
🔗 [NextDiscord Demo](https://nextdiscord-swart.vercel.app/)

## Tech Stack

- **Next.js** - React framework for SSR and static site generation
- **Redux** - Global state management
- **Firebase Firestore** - NoSQL database for storing messages and user data
- **Tailwind CSS** - Styling framework for modern UI
- **React Hooks** - Efficient state and lifecycle management
- **Pusher (Coming Soon)** - Real-time messaging

## Installation

### Prerequisites
Ensure you have Node.js and npm/yarn installed.

### Clone the repository
```bash
git clone git@github.com:nizamani/nextdiscord.git
cd discord-clone
```

### Install dependencies
```bash
npm install  # or yarn install
```

### Setup Firebase
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Authentication**.
3. Copy `.env.example` to `.env.local` and add your Firebase credentials:

```env
# .env.local (DO NOT COMMIT THIS FILE)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

### Run the application
```bash
npm run dev  # or yarn dev
```
The app will be available at `http://localhost:3000`

## Project Structure
```
📦 nextdiscord
├── 📂 components   # Reusable React components
├── 📂 pages        # Next.js pages
├── 📂 redux        # Redux store and slices
├── 📂 types        # Types used through out the app
├── 📂 firebase     # Firebase configuration
├── 📂 public       # Static assets like images
├── .env.example    # Example environment variables
├── .env.local      # Environment variables (ignored in Git)
└── next.config.js  # Next.js configuration
```

## Future Enhancements
- 🔐 OAuth authentication (Google, GitHub, etc.)
- 📢 Voice and video call integration
- 🚀 Message reactions and thread replies
- 👥 **User authentication** (Firebase Auth or custom implementation)
- 📸 **User profile management** with avatars
- 🔄 **Real-time messaging using Pusher**

## Contributing
Pull requests are welcome! Feel free to fork the repo and submit improvements.

## License
This project is licensed under the **MIT License**.

---
Made with ❤️ using Next.js and Firebase!

