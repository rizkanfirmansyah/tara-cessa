import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowTrendDown, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components";
import { ThemeType } from "@/types";


interface CardChartProps {
    icon: IconProp;
    theme?: ThemeType;
    up?: boolean;
    title: string;
    value: string;
    percentage?: string;
    description?: string;
}

export default function CardChart({ icon, up, title, value, theme, percentage, description }: CardChartProps) {
    const themeSelect = theme ?? 'default';
    const themes: Record<ThemeType, string> = {
        'default': 'bg-success-light  ',
        'primary': 'bg-blue-200',
        'success': 'bg-success-light  ',
        'warning': 'bg-yellow-100',
        'secondary': 'bg-semi-light',
        'dark': 'bg-dark',
        'light': 'bg-light',
        'danger': 'bg-red-200',
    };
    const themesIcon: Record<ThemeType, string> = {
        'default': 'text-success ',
        'success': 'text-success ',
        'primary': 'text-primary',
        'warning': 'text-warning',
        'secondary': 'text-muted',
        'dark': 'text-light',
        'light': 'text-dark',
        'danger': 'text-danger ',
    };
    return (
        <Card>
            <h3 className="text-sm flex items-center justify-start"><div className={`${themes[themeSelect]} dark:bg-dark w-6 h-6 rounded-full flex justify-center items-center`}><FontAwesomeIcon className={`w-4  ${themesIcon[themeSelect]} dark:text-light`} icon={icon} /></div> <span className="ms-3">{title}</span></h3>
            <h1 className="text-h4 font-semibold mt-2">{value}</h1>
            {up ? (
                <span className="text-sm flex text-green-60 mt-2"><FontAwesomeIcon className="w-4 text-success" icon={faArrowTrendUp} /> <span className="mx-1 text-success">{percentage ?? ''}</span> <span className="text-muted">{description ?? 'in the last 1 month'}</span></span>
            ) :
                (
                    <span className="text-sm flex text-green-60 mt-2"><FontAwesomeIcon className="w-4 text-danger" icon={faArrowTrendDown} /> <span className="mx-1 text-danger">{percentage ?? ''}</span> <span className="text-muted">{description ?? 'in the last 1 month'}</span></span>
                )}
        </Card>
    );
}