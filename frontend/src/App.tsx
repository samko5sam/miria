import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="bg-white dark:bg-background-dark font-display text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#1a1a1a',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: theme === 'dark' ? '#fff' : '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: theme === 'dark' ? '#fff' : '#1a1a1a',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
