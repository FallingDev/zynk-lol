import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: 'glass' | 'outlined' | 'soft'
  hover?: boolean
}

export function GlassCard({
  children,
  className,
  variant = 'glass',
  hover = true,
  ...props
}: GlassCardProps) {
  const variants = {
    glass: 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]',
    outlined: 'bg-transparent border-2 border-white/[0.08]',
    soft: 'bg-[#111] border-none',
  }

  return (
    <div
      className={cn(
        'rounded-[16px] p-6',
        variants[variant],
        hover && 'transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
