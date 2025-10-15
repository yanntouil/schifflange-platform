import { Loader as LucideLoader, LoaderCircle as LucideLoaderCircle } from "lucide-react"
import React from "react"
import { cn } from "@compo/utils"
import "./loader.css"

type LoaderProps = {
  variant?:
    | "circular"
    | "classic"
    | "circle"
    | "round"
    | "pulse"
    | "pulse-dot"
    | "dots"
    | "typing"
    | "wave"
    | "bars"
    | "terminal"
    | "text-blink"
    | "text-shimmer"
    | "loading-dots"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const CircularLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className='icon p-[1px]' {...props}>
      <div
        className={cn(
          "border-[currentcolor] animate-spin rounded-full border-[1.5px] border-t-transparent size-full",
          className
        )}
      />
    </div>
  )
}

/**
 * ClassicLoader
 */
const ClassicLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("icon", className)} {...props}>
      <LucideLoader className='size-full animate-spin text-[currentcolor]' />
    </div>
  )
}

/**
 * CircleLoader
 */
const CircleLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("icon", className)} {...props}>
      <LucideLoaderCircle className='size-full animate-spin text-[currentcolor]' />
    </div>
  )
}

/**
 * RoundLoader
 */
const RoundLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("icon p-[1px]", className)} {...props}>
      <svg className={cn("animate-spin size-full fill-[currentcolor]")} viewBox='3 3 18 18'>
        <path
          className='opacity-20'
          d='M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z'
        />
        <path d='M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z' />
      </svg>
    </div>
  )
}

/**
 * PulseLoader
 */
const PulseLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("icon p-[1px]", className)} {...props}>
      <div className='border-[currentcolor] size-full animate-[thin-pulse_1.5s_ease-in-out_infinite] rounded-full border-[1.5px]' />
    </div>
  )
}

/**
 * PulseDotLoader
 */
const PulseDotLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("icon p-[1px] flex items-center justify-center", className)} {...props}>
      <div
        className={cn(
          "bg-[currentcolor] animate-[pulse-dot_1.2s_ease-in-out_infinite] rounded-full size-[30%]",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * DotsLoader
 */
const DotsLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("flex items-center justify-between icon", className)} {...props}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-[currentcolor] animate-[bounce-dots_1.4s_ease-in-out_infinite] rounded-full w-[25%] aspect-square"
          )}
          style={{
            animationDelay: `${i * 160}ms`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * TypingLoader
 */
const TypingLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("flex items-center justify-between icon", className)} {...props}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn("bg-[currentcolor] animate-[typing_1s_infinite] rounded-full w-[25%] aspect-square")}
          style={{
            animationDelay: `${i * 250}ms`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * WaveLoader
 */
const WaveLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("flex items-center justify-between icon p-[1px]", className)} {...props}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn("bg-[currentcolor] animate-[wave_1s_ease-in-out_infinite] rounded-full w-[7%]")}
          style={{
            animationDelay: `${i * 100}ms`,
            height: ["62.5%", "93.75%", "125%", "93.75%", "62.5%"][i],
          }}
        />
      ))}
    </div>
  )
}

/**
 * BarsLoader
 */
const BarsLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("flex items-center justify-between icon p-[1px]", className)} {...props}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn("bg-[currentcolor] h-full animate-[wave-bars_1.2s_ease-in-out_infinite] w-[25%]")}
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * TerminalLoader
 */
const TerminalLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cn("flex items-center gap-1 icon p-[1px]", className)} {...props}>
      <span className='text-[currentcolor] font-mono'>{">"}</span>
      <div className='bg-[currentcolor] animate-[blink_1s_step-end_infinite] h-[75%] aspect-[1/6]' />
    </div>
  )
}

const Loader: React.FC<LoaderProps> = ({ variant = "circular", size = "md", text, className, ...props }) => {
  switch (variant) {
    case "classic":
      return <ClassicLoader className={className} {...props} />
    case "circle":
      return <CircleLoader className={className} {...props} />
    case "round":
      return <RoundLoader className={className} {...props} />
    case "pulse":
      return <PulseLoader className={className} {...props} />
    case "pulse-dot":
      return <PulseDotLoader className={className} {...props} />
    case "dots":
      return <DotsLoader className={className} {...props} />
    case "typing":
      return <TypingLoader className={className} {...props} />
    case "wave":
      return <WaveLoader className={className} {...props} />
    case "bars":
      return <BarsLoader className={className} {...props} />
    case "terminal":
      return <TerminalLoader className={className} {...props} />
    default:
      return <CircularLoader className={className} {...props} />
  }
}

export { Loader }
