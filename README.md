<<<<<<< Updated upstream

=======
# Modern Developer Portfolio

A high-performance, visually stunning developer portfolio built with React, Vite, and Tailwind CSS. This project features a fully functional Admin Panel for managing content dynamically without touching the code.

## 🚀 Features

### Public Portfolio
- **Dynamic Content**: Projects, Certificates, and Tech Stack are fetched from Supabase.
- **Responsive Design**: Fully optimized for all devices (Mobile, Tablet, Desktop).
- **Modern UI/UX**: Glassmorphism effects, smooth animations, and interactive elements.
- **Dark Mode**: Sleek dark theme by default.
- **Performance**: Optimized with Vite for lightning-fast load times.

### Admin Panel
- **Secure Authentication**: Protected routes for admin access.
- **Dashboard**: Quick overview of your content.
- **Project Management**: Add, edit, delete, and reorder projects.
- **Certificate Management**: Add, edit, delete, and reorder certificates.
- **Tech Stack Management**: Add, edit, delete, and reorder skills.
- **Display Order System**: Custom priority system (1, 2, 3...) to control the exact order of items on the frontend.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend/Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM
- **State Management**: React Hooks

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

## 📝 Usage

### Accessing the Admin Panel
Navigate to `/admin` (e.g., `http://localhost:5173/admin`).
*Note: Ensure you have set up authentication in Supabase or disabled the auth guard for local testing if needed.*

### Managing Content
- **Projects**: Upload images, add descriptions, live links, and GitHub repos.
- **Display Order**: Use the "Display Order" field to sort items. Lower numbers (e.g., 1) appear first. Default is 999.

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components (Navbar, Cards, etc.)
├── Pages/
│   ├── Admin/         # Admin panel pages (Dashboard, Projects, etc.)
│   ├── Home.jsx       # Landing page
│   ├── Portfolio.jsx  # Projects & Certificates page
│   └── ...
├── hooks/             # Custom React hooks
├── supabase.js        # Supabase client configuration
└── main.jsx           # Entry point
```

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any improvements or new features!

---
Built with ❤️ using React & Tailwind CSS.
>>>>>>> Stashed changes
