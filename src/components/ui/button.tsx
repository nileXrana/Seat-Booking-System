import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive'
    size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    {
                        'bg-slate-900 text-white shadow hover:bg-slate-900/90 hover:shadow-md': variant === 'default',
                        'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 text-slate-900': variant === 'outline',
                        'hover:bg-slate-100 hover:text-slate-900': variant === 'ghost',
                        'bg-red-500 text-white shadow-sm hover:bg-red-600': variant === 'destructive',
                        'h-10 px-4 py-2': size === 'default',
                        'h-9 rounded-md px-3': size === 'sm',
                        'h-11 rounded-md px-8': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
