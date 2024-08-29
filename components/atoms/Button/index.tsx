"use client";
import { ThemeType } from "@/types";
import { ReactNode } from "react";

type ButtonType = "button" | "submit" | "reset";

interface ButtonProps {
    theme?: ThemeType;
    className?: string;
    size?: string;
    title?: string;
    disabled?: boolean;
    type?: ButtonType;
    children?: ReactNode;
    onClick?: () => void;
}

export default function Button({ onClick, children, theme, className, size, type, title, disabled }: ButtonProps) {
    const themeSelect = theme ?? "default";
    const themes: Record<ThemeType, string> = {
        default: "bg-primary text-light ",
        primary: "bg-primary text-light ",
        success: "bg-success text-light ",
        warning: "bg-warning text-light ",
        secondary: "bg-muted text-light ",
        dark: "bg-dark text-light ",
        light: "bg-light text-dark ",
        danger: "bg-danger text-light ",
    };
    return (
        <button title={title} type={type ?? "button"} className={`${disabled ? themes["secondary"] : themes[themeSelect]} ${size == "sm" ? "px-2" : "px-5"} py-2 rounded-md ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
