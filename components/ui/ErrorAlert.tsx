// components/ui/ErrorAlert.tsx
interface ErrorAlertProps {
    message: string | null;
    className?: string;
}

export default function ErrorAlert({ message, className = '' }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className={`bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm ${className}`}>
            {message}
        </div>
    );
}