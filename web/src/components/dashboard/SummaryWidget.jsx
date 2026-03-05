import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SummaryWidget = ({ title, value, subtext, highlightColorClass, backgroundHighlightClass, children }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between h-32 hover:shadow-md transition-shadow relative overflow-hidden group">
            {backgroundHighlightClass && (
                <div className={cn("absolute right-0 top-0 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-70 group-hover:opacity-100", backgroundHighlightClass)}></div>
            )}
            <h3 className="text-slate-500 dark:text-slate-400 font-semibold tracking-wide text-xs uppercase z-10">{title}</h3>
            <div className="flex items-end gap-2 z-10">
                <p className={cn("text-4xl font-bold text-slate-800 dark:text-slate-100", highlightColorClass)}>{value}</p>
                {subtext && <span className="text-slate-400 dark:text-slate-500 mb-1 font-medium">{subtext}</span>}
            </div>
            {children}
        </div>
    );
};

export default SummaryWidget;
