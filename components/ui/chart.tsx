"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: Record<string, { label: string; color: string }>
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <style jsx global>{`
          ${Object.entries(config)
            .map(([key, value]) => `.recharts-layer .${key} { fill: ${value.color}; stroke: ${value.color}; }`)
            .join("\n")}
        `}</style>
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ children, ...props }: React.ComponentProps<typeof Tooltip>) => {
  return (
    <TooltipProvider>
      <Tooltip {...props}>{children}</Tooltip>
    </TooltipProvider>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{ name: string; value: number | string }>
  label?: string
  hideLabel?: boolean
}

const ChartTooltipContent = ({ active, payload, label, hideLabel }: ChartTooltipContentProps) => {
  if (active && payload?.length) {
    return (
      <TooltipContent className="flex flex-col gap-2">
        {!hideLabel && <p className="font-medium">{label}</p>}
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full bg-${item.name}`} />
            <p className="font-medium">
              {item.name}: {item.value}
            </p>
          </div>
        ))}
      </TooltipContent>
    )
  }

  return null
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }