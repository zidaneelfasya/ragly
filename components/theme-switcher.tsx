"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-muted rounded-full animate-pulse"></div>
    );
  }

  // Use resolvedTheme to handle 'system' theme correctly
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-7 w-14 items-center rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        hover:scale-105 active:scale-95
        ${isDark 
          ? "bg-slate-700 dark:bg-slate-600 shadow-inner" 
          : "bg-amber-400 shadow-md"
        }
      `}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Circle */}
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full
          transition-all duration-300 ease-in-out
          shadow-lg flex items-center justify-center
          ${isDark 
            ? "translate-x-[1.875rem] bg-slate-800 dark:bg-slate-900" 
            : "translate-x-1 bg-white"
          }
        `}
      >
        {/* Icon inside circle */}
        {isDark ? (
          <Moon size={12} className="text-slate-100" />
        ) : (
          <Sun size={12} className="text-amber-500" />
        )}
      </span>
      
      {/* Background Icons */}
      <Sun
        size={13}
        className={`
          absolute left-1.5 transition-all duration-300
          ${isDark 
            ? "opacity-30 text-slate-400" 
            : "opacity-0 text-white"
          }
        `}
      />
      
      <Moon
        size={13}
        className={`
          absolute right-1.5 transition-all duration-300
          ${isDark 
            ? "opacity-0 text-slate-200" 
            : "opacity-30 text-amber-700"
          }
        `}
      />
    </button>
  );
};

export { ThemeSwitcher };
