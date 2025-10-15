import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { A, G, cn } from "@compo/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-2 w-full grow overflow-hidden rounded-full bg-secondary'>
      <SliderPrimitive.Range className='absolute h-full bg-primary' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

type SliderRangedProps = Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "min" | "max" | "step" | "value" | "onValueChange"
> & {
  ranges: { start: number; end: number; step: number }[]
  value: number
  onValueChange: (value: number) => void
}
const SliderRanged = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderRangedProps>(
  ({ className, ranges, value, onValueChange, ...props }, ref) => {
    const ranged = React.useMemo(() => makeRange(ranges), [ranges])
    const sliderValue = React.useMemo(() => {
      const index = ranged.indexOf(value)
      return index === -1 ? 0 : index
    }, [value, ranged])
    return (
      <Slider
        className={className}
        ref={ref}
        {...props}
        value={[sliderValue]}
        onValueChange={(values) => {
          const index = A.head(values)
          if (G.isNullable(index)) return
          const value = ranged[index]
          if (G.isNullable(value)) return
          onValueChange(value)
        }}
        min={0}
        max={ranged.length - 1}
        step={1}
      />
    )
  }
)
SliderRanged.displayName = SliderPrimitive.Root.displayName

export { Slider, SliderRanged }

/**
 * makeRange
 * make a range of numbers from a list of ranges
 */
const makeRange = (ranges: { start: number; end: number; step: number }[]) => {
  const lastRange = A.last(ranges)
  if (!lastRange) throw new Error("makeRange: no range")
  return [
    ...ranges.reduce((acc, range) => {
      const n = (range.end - range.start) / range.step
      if (Math.round(n) !== n) throw new Error("makeRange: invalid range")
      const currentRange = A.makeWithIndex(n, (i) => i * range.step + range.start)
      return [...acc, ...currentRange]
    }, Array<number>()),
    lastRange.end,
  ]
}
