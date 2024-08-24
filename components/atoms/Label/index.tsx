interface labelProps {
    title: string;
    htmlFor?: string;
    className?: string;
}

export default function Label({ title, htmlFor, className }: labelProps) {
    let htmlForValue: string = htmlFor || title.toLowerCase();
    return (
        <label htmlFor={htmlForValue} className={`dark:text-light text-dark text-body font-medium ${className}`} >{title}</label >
    );
}