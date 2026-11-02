# Frontend Boilerplate

This is a **Next.js** boilerplate project with essential dependencies and configurations to get started quickly.

## 📂 Project Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/desolintdev/frontend-boilerplate.git
cd frontend-boilerplate
```

### 2️⃣ Create `.env.local` File

Create an `.env.local` file in the root directory and add the following environment variables:

```env
NEXT_PUBLIC_SERVER_URL="http://localhost:3001"
NEXT_PUBLIC_ENVIRONMENT="development"
NEXT_PUBLIC_SENTRY_DSN="your_sentry_dsn_here"
NEXT_PUBLIC_GOOGLE_API_KEY="your_google_api_key_here"
```

### 3️⃣ Install Dependencies

Run the following command to install all necessary packages:

```sh
npm install
```

### 4️⃣ Run the Development Server

Start the local development server with:

```sh
npm run dev
```

The project will run at: **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Available Scripts

### 🔹 `npm run dev`

Runs the development server.

### 🔹 `npm run build`

Builds the project for production.

### 🔹 `npm run start`

Starts the production server after building.

### 🔹 `npm run lint`

Runs ESLint to check for code quality issues.

---

## 📚 Tech Stack

- **Next.js 15** – React framework for SSR & static site generation
- **React 19** – Component-based UI development
- **Tailwind 4** - CSS Framework with Utility Classes
- **ShadCN** - Set of Beautifully Designed Components
- **Redux Toolkit & Redux Persist** – State management
- **TanStack React Query** – Data fetching & caching
- **React Hook Form & Yup** – Form handling & validation
- **Axios** – HTTP client for API requests
- **i18next & react-i18next** – Internationalization support
- **Next i18n Router** – Route-based language handling
- **Socket.io Client** – Real-time communication
- **React Toastify** – Notifications & alerts
- **Sentry** – Error tracking & monitoring
- **JWT Decode** – Decoding JSON Web Tokens
- **React Modal** – Accessible modal dialogs
- **React Icons** – Icon set for UI elements

---

## 🚀 Deployment

For production, build and start the server:

```sh
npm run build
npm run start
```

---

## 📌 Notes

- Ensure you have **Node.js 18+** installed.
- Update `.env.local` with actual values before deploying.
- Use **Redux Persist** for state persistence in the browser.
- **React Query** is used for efficient data fetching and caching.
- The project includes **JWT-based authentication**.
- **Google Maps API** integration is available.

Happy Coding! 🎉
