"use client"

import { Ui } from "@compo/ui"
import { cn } from "@compo/utils"
import { ChevronDown } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { HexColorPicker, HslaColor, HslaColorPicker } from "react-colorful"
import {
  FormGroup,
  FormGroupClassNames,
  FormGroupProps,
  extractGroupProps,
  extractInputProps,
  useFieldContext,
} from "."

type FormColorProps = FieldColorProps &
  FormGroupProps & {
    classNames?: FormGroupClassNames<{
      input?: string
      trigger?: string
      content?: string
      recent?: string
    }>
  }

/**
 * FormColor
 */
export const FormColor: React.FC<FormColorProps> = ({ classNames, ...props }) => {
  return (
    <FormGroup {...extractGroupProps(props)} classNames={classNames}>
      <FieldColor {...extractInputProps({ ...props })} classNames={classNames} />
    </FormGroup>
  )
}

/**
 * FieldColor
 */
type FieldColorProps = {
  disabled?: boolean
  placeholder?: string
  classNames?: {
    input?: string
    trigger?: string
    content?: string
    recent?: string
  }
}

const RECENT_COLORS_KEY = "form-color-recent"
const MAX_RECENT_COLORS = 5

// Helper functions for color detection and conversion
const isHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color)
}

const isHslaColor = (color: string): boolean => {
  return /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)$/i.test(color)
}

const isValidColor = (color: string): boolean => {
  return isHexColor(color) || isHslaColor(color)
}

const hslaToString = (hsla: HslaColor): string => {
  return `hsla(${Math.round(hsla.h)}, ${Math.round(hsla.s)}%, ${Math.round(hsla.l)}%, ${hsla.a})`
}

const hslaToHex = (hsla: HslaColor): string => {
  const { h, s, l } = hsla
  const hNorm = h / 360
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (0 <= hNorm * 6 && hNorm * 6 < 1) {
    r = c
    g = x
    b = 0
  } else if (1 <= hNorm * 6 && hNorm * 6 < 2) {
    r = x
    g = c
    b = 0
  } else if (2 <= hNorm * 6 && hNorm * 6 < 3) {
    r = 0
    g = c
    b = x
  } else if (3 <= hNorm * 6 && hNorm * 6 < 4) {
    r = 0
    g = x
    b = c
  } else if (4 <= hNorm * 6 && hNorm * 6 < 5) {
    r = x
    g = 0
    b = c
  } else if (5 <= hNorm * 6 && hNorm * 6 < 6) {
    r = c
    g = 0
    b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

const stringToHsla = (colorString: string): HslaColor => {
  // Try to parse HSLA string
  const hslaMatch = colorString.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)/)
  if (hslaMatch) {
    return {
      h: parseInt(hslaMatch[1]),
      s: parseInt(hslaMatch[2]),
      l: parseInt(hslaMatch[3]),
      a: hslaMatch[4] ? parseFloat(hslaMatch[4]) : 1,
    }
  }

  // Try to parse hex and convert to HSLA
  const hexMatch = colorString.match(/^#([0-9A-F]{6})$/i)
  if (hexMatch) {
    return hexToHsla(hexMatch[0])
  }

  // Default fallback
  return { h: 0, s: 0, l: 0, a: 1 }
}

const hexToHsla = (hex: string): HslaColor => {
  // Convert hex to RGB first
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: 1,
  }
}

const FieldColor: React.FC<FieldColorProps> = ({
  disabled: fieldDisabled,
  placeholder = "hsla(0, 0%, 0%, 1)",
  classNames,
}) => {
  const { value, setFieldValue, disabled: ctxDisabled } = useFieldContext<string | null>()
  const disabled = fieldDisabled || ctxDisabled
  const [recentColors, setRecentColors] = useState<string[]>([])

  // Internal state for input - only syncs to value when valid
  const [internalValue, setInternalValue] = useState<string>(value || placeholder)

  // Picker state based on current format
  const [hslaColor, setHslaColor] = useState<HslaColor>(stringToHsla(value || placeholder))
  const [hexColor, setHexColor] = useState<string>(
    isHexColor(value || placeholder) ? value || placeholder : hslaToHex(stringToHsla(value || placeholder))
  )

  // Load recent colors from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_COLORS_KEY)
      if (stored) {
        setRecentColors(JSON.parse(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Save recent colors to localStorage
  const saveRecentColor = useCallback((color: string) => {
    setRecentColors((prev) => {
      const updated = [color, ...prev.filter((c) => c !== color)].slice(0, MAX_RECENT_COLORS)
      try {
        localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated))
      } catch {
        // Ignore localStorage errors
      }
      return updated
    })
  }, [])

  // Handle internal input change
  const handleInputChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue)

      // If empty, set to null
      if (newValue.trim() === "") {
        setFieldValue(null)
        return
      }

      // If valid, update the field value and picker states immediately
      if (isValidColor(newValue)) {
        setFieldValue(newValue)
        saveRecentColor(newValue)

        if (isHexColor(newValue)) {
          setHexColor(newValue)
          setHslaColor(hexToHsla(newValue))
        } else if (isHslaColor(newValue)) {
          setHslaColor(stringToHsla(newValue))
          setHexColor(hslaToHex(stringToHsla(newValue)))
        }
      }
    },
    [setFieldValue, saveRecentColor]
  )

  // Handle blur - reset to actual value if invalid
  const handleInputBlur = useCallback(() => {
    if (internalValue.trim() !== "" && !isValidColor(internalValue)) {
      setInternalValue(value || "")
    }
  }, [internalValue, value])

  // Handle keyboard shortcuts
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" && !disabled) {
        e.preventDefault()
        setOpen(true)
      }
    },
    [disabled]
  )

  // Handle HSLA picker change
  const handleHslaChange = useCallback(
    (hsla: HslaColor) => {
      setHslaColor(hsla)
      const colorString = hslaToString(hsla)
      setInternalValue(colorString)
      setFieldValue(colorString)
      saveRecentColor(colorString)
      setHexColor(hslaToHex(hsla))
    },
    [setFieldValue, saveRecentColor]
  )

  // Handle Hex picker change
  const handleHexChange = useCallback(
    (hex: string) => {
      setHexColor(hex)
      setInternalValue(hex)
      setFieldValue(hex)
      saveRecentColor(hex)
      setHslaColor(hexToHsla(hex))
    },
    [setFieldValue, saveRecentColor]
  )

  // Handle predefined color selection
  const handleColorSelect = useCallback(
    (color: string) => {
      setInternalValue(color)
      setFieldValue(color)
      saveRecentColor(color)

      if (isHexColor(color)) {
        setHexColor(color)
        setHslaColor(hexToHsla(color))
      } else {
        setHslaColor(stringToHsla(color))
        setHexColor(hslaToHex(stringToHsla(color)))
      }
    },
    [setFieldValue, saveRecentColor]
  )

  // Sync internal state when value changes externally
  useEffect(() => {
    const newValue = value || ""
    setInternalValue(newValue)

    if (isHexColor(newValue)) {
      setHexColor(newValue)
      setHslaColor(hexToHsla(newValue))
    } else {
      setHslaColor(stringToHsla(newValue))
      setHexColor(hslaToHex(stringToHsla(newValue)))
    }
  }, [value])

  const currentColor = value || placeholder
  const isCurrentValid = isValidColor(currentColor)
  const isInternalValid = isValidColor(internalValue)
  const isHexMode = isHexColor(internalValue)

  const [open, setOpen] = useState(false)

  return (
    <Ui.Popover.Root open={open} onOpenChange={setOpen}>
      <div className='relative group isolate'>
        {/* Color preview */}
        <Ui.Popover.Trigger asChild>
          <button
            type='button'
            className={cn(
              "absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded border border-border",
              !isCurrentValid && "bg-muted"
            )}
            style={{
              backgroundColor: isCurrentValid ? currentColor : undefined,
            }}
          />
        </Ui.Popover.Trigger>
        <Ui.Input
          value={internalValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "font-mono text-xs pl-12 pr-10",
            "group-focus-within:outline-none group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2 group-focus-within:ring-offset-background",
            // hasError && "border-destructive",
            classNames?.trigger
          )}
        />

        {/* Popover trigger */}
        <span
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
          onClick={() => disabled || setOpen(true)}
          aria-hidden
        >
          <ChevronDown className='h-4 w-4 opacity-50' />
        </span>

        <Ui.Popover.Content
          className={cn("w-80 p-4", classNames?.content)}
          side='bottom'
          align='start'
          style={{
            maxHeight: "var(--radix-popover-content-available-height)",
            maxWidth: "var(--radix-popover-content-available-width)",
          }}
        >
          <div className='space-y-4'>
            {/* Color Picker - Dynamic based on format */}
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-sm text-muted-foreground'>Mode:</span>
                <span className='text-sm font-medium'>{isHexMode ? "Hexadécimal" : "HSLA"}</span>
              </div>

              {isHexMode ? (
                <HexColorPicker color={hexColor} onChange={handleHexChange} style={{ width: "100%" }} />
              ) : (
                <HslaColorPicker color={hslaColor} onChange={handleHslaChange} style={{ width: "100%" }} />
              )}
            </div>

            {/* Recent Colors */}
            {recentColors.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-medium text-muted-foreground'>Couleurs récentes</p>
                <div className={cn("flex flex-wrap gap-2", classNames?.recent)}>
                  {recentColors.map((color, index) => (
                    <button
                      key={`${color}-${index}`}
                      type='button'
                      onClick={() => handleColorSelect(color)}
                      className={cn(
                        "h-8 w-8 rounded border border-border hover:ring-2 hover:ring-ring hover:ring-offset-2",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        "transition-all duration-200"
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Predefined Colors */}
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground'>Couleurs prédéfinies</p>
              <div className='grid grid-cols-6 gap-2'>
                {[
                  "#000000", // noir
                  "#ffffff", // blanc
                  "#ef4444", // rouge
                  "#f97316", // orange
                  "#eab308", // jaune
                  "#22c55e", // vert
                  "#3b82f6", // bleu
                  "#8b5cf6", // violet
                  "#ec4899", // rose
                  "#64748b", // gris
                  "hsla(0, 84%, 60%, 0.8)", // rouge semi-transparent
                  "hsla(217, 91%, 60%, 0.6)", // bleu semi-transparent
                ].map((color) => (
                  <button
                    key={color}
                    type='button'
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                      "h-8 w-8 rounded border border-border hover:ring-2 hover:ring-ring hover:ring-offset-2",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "transition-all duration-200"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </Ui.Popover.Content>
      </div>
    </Ui.Popover.Root>
  )
}
