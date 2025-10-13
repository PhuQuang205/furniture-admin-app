"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

const ThemeToggleButton: React.FC = () => {
    // 1️⃣ State for current theme
    const [theme, setTheme] = React.useState<string | null>(null);

    // 2️⃣ Update theme on <html> element
    const updateThemeOnHtmlEl = (theme: string) => {
        if (typeof window !== "undefined") {
            document.documentElement.setAttribute("data-theme", theme);
        }
    };

    // 3️⃣ Load saved theme from localStorage after mount
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme") || "light";
            setTheme(storedTheme);
            updateThemeOnHtmlEl(storedTheme);
        }
    }, []);

    // 4️⃣ Toggle theme
    const handleThemeToggle = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);

        if (typeof window !== "undefined") {
            localStorage.setItem("theme", newTheme);
            updateThemeOnHtmlEl(newTheme);
        }
    };

    // 5️⃣ Don’t render until theme is loaded (to avoid hydration mismatch)
    if (!theme) return null;

    return (
        <button
            type="button"
            aria-label="Toggle Theme"
            onClick={handleThemeToggle}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/70 transition"
        >
            {theme === "dark" ? (
                <Icon icon="solar:sun-outline" className="w-5 h-5 text-yellow-500" />
            ) : (
                <Icon icon="solar:moon-outline" className="w-5 h-5 text-slate-700" />
            )}
        </button>
    );
};

export default ThemeToggleButton;
