'use client'
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

export default function ToogleMode() {
    const { systemTheme, theme, setTheme } = useTheme();

    const renderThemeChanger = () => {
        const currentTheme = theme === "system" ? systemTheme : theme;
        if (currentTheme === "dark") {
            return (
                <a href="#" className="flex justify-between items-center hover:bg-light dark:hover:text-dark px-4 py-2 text-sm" role="menuitem" onClick={() => setTheme('light')}>Light
                    <FontAwesomeIcon icon={faSun} /></a>
            )
        }

        else {
            return (
                <a href="#" className="flex justify-between items-center hover:bg-light dark:hover:text-dark block px-4 py-2 text-sm" role="menuitem" onClick={() => setTheme('dark')}>Dark <FontAwesomeIcon icon={faMoon} /></a>
            )
        }
    };
    return (
        <div className="text-black dark:text-white">
            {renderThemeChanger()}
        </div>
    )
}