# LibraryApp Frontend 📚✨

A modern, highly bold, and reactive library management interface built for curators.

## 🚀 Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript (Strict Type-Safety)
- **State Management:** Zustand
- **Forms & Validation:** React Hook Form + Zod
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS (Custom Dark-Academia & Glassmorphic theme)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **API Client:** Axios (Custom Generic Response Wrappers)

---

## 🎨 Design Philosophy
This frontend diverges from generic "AI slop" or standard dashboards by employing a striking visual direction: **Dark-Academia Glassmorphism**.
- Variable, premium typography using `Playfair Display` and `Outfit`.
- Fluid animations utilizing Framer Motion for high-impact interactions.
- Complex ambient CSS compositions (blobs/blurs/gradients) to create undeniable atmosphere.

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) or npm

### Installation

1. Clone the repository and navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install the necessary NPM dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

### Environment Configuration

Create a `.env` file at the root of the `Frontend` folder. You must configure the URL pointing to your backend library API:
```env
VITE_API_URL=https://localhost:7103/api
```
*(Ensure the port matches the one running your ASP.NET Core API or your production backend).*

### Running the Development Server

1. Start the Vite development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.

**Default Admin Credentials (for testing):**
- Email: `admin@library.com`
- Password: `Admin123!`

---

## 🛠️ Project Structure

- `/src/api`: Centralized Axios instances, DTO types, API services by domain, and the generic Response Wrapper to sanitize the ASP.NET Core outputs.
- `/src/components`: UI components, including generalized Buttons and the Main/Sidebar layouts.
- `/src/context` (Deprecated) -> `/src/store`: Global state management powered strictly by Zustand (`authStore.ts`).
- `/src/pages`: Distinct application views (Login, Dashboard, Books, Authors, Categories).
- `/src/routes`: Route protection mechanisms mapping to user Role Claims.
