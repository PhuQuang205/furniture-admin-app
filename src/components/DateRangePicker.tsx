"use client"

import * as React from "react"
import {
  addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  subWeeks, subMonths, isAfter, startOfQuarter, endOfQuarter,
  subQuarters, startOfYear, endOfYear, subYears
} from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export type EmitParams = { period?: string; startDate?: string; endDate?: string, date?: string }

const today = new Date()
const clampToToday = (d: Date) => (isAfter(d, today) ? today : d)
const fmtApi = (d: Date) => format(d, "yyyy-MM-dd") // đổi sang dạng yyyy-MM-dd để gọi API /stats/by-day

const PRESETS = [
  { label: "Today", key: "TODAY", range: () => ({ from: today, to: today }) },
  {
    label: "Yesterday", key: "YESTERDAY", range: () => {
      const y = addDays(today, -1)
      return { from: y, to: y }
    }
  },
  { label: "This Week", key: "THIS_WEEK", range: () => ({
      from: startOfWeek(today, { weekStartsOn: 1 }),
      to: clampToToday(endOfWeek(today, { weekStartsOn: 1 })),
  })},
  { label: "Last Week", key: "LAST_WEEK", range: () => ({
      from: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      to: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
  })},
  { label: "This Month", key: "THIS_MONTH", range: () => ({
      from: startOfMonth(today),
      to: clampToToday(endOfMonth(today)),
  })},
  { label: "Last Month", key: "LAST_MONTH", range: () => ({
      from: startOfMonth(subMonths(today, 1)),
      to: endOfMonth(subMonths(today, 1)),
  })},
  { label: "This Quarter", key: "THIS_QUARTER", range: () => ({
      from: startOfQuarter(today),
      to: clampToToday(endOfQuarter(today)),
  })},
  { label: "Last Quarter", key: "LAST_QUARTER", range: () => {
      const prev = subQuarters(today, 1)
      return { from: startOfQuarter(prev), to: endOfQuarter(prev) }
  }},
  { label: "This Year", key: "THIS_YEAR", range: () => ({
      from: startOfYear(today),
      to: clampToToday(endOfYear(today)),
  })},
  { label: "Last Year", key: "LAST_YEAR", range: () => {
      const prev = subYears(today, 1)
      return { from: startOfYear(prev), to: endOfYear(prev) }
  }},
  { label: "Custom", key: "CUSTOM", range: null },
]

export function DateRangePicker({
  onChange,
  defaultPresetKey = "THIS_WEEK",
}: {
  onChange?: (params: EmitParams) => void
  defaultPresetKey?: string
}) {
  const defaultPreset = PRESETS.find((p) => p.key === defaultPresetKey) ?? PRESETS[0]
  const defaultRange = defaultPreset.range ? defaultPreset.range()! : { from: undefined, to: undefined }

  const [open, setOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange>(defaultRange as DateRange)
  const [mode, setMode] = React.useState<"preset" | "custom">("preset")
  const [activePresetKey, setActivePresetKey] = React.useState<string>(defaultPreset.key)

  const emitParams = React.useCallback((params: EmitParams) => {
    onChange?.(params)
  }, [onChange])

  React.useEffect(() => {
    if (defaultPreset.key && defaultPreset.key !== "CUSTOM") {
      // nếu là Today hoặc Yesterday thì dùng by-day
      if (defaultPreset.key === "TODAY") {
        emitParams({ date: fmtApi(today) })
      } else if (defaultPreset.key === "YESTERDAY") {
        const y = addDays(today, -1)
        emitParams({ date: fmtApi(y) })
      } else {
        emitParams({ period: defaultPreset.key })
      }
    } else if (range?.from && range?.to) {
      emitParams({ startDate: fmtApi(range.from), endDate: fmtApi(range.to) })
    }
  }, [])

  const handlePreset = (preset: (typeof PRESETS)[number]) => {
    if (preset.key === "CUSTOM") {
      setMode("custom")
      setActivePresetKey("CUSTOM")
      return
    }

    const r = preset.range?.()
    if (r) {
      const from = r.from && isAfter(r.from, today) ? today : r.from
      const to = r.to && isAfter(r.to, today) ? today : r.to
      setRange({ from, to })
      setMode("preset")
      setActivePresetKey(preset.key)

      // 🟩 Logic API đặc biệt cho Today/Yesterday
      if (preset.key === "TODAY") {
        emitParams({ date: fmtApi(today) })
      } else if (preset.key === "YESTERDAY") {
        const y = addDays(today, -1)
        emitParams({ date: fmtApi(y) })
      } else {
        emitParams({ period: preset.key })
      }

      setOpen(false)
    }
  }

  const handleSelectRange = (r?: DateRange) => {
    if (!r) return
    const from = r.from && isAfter(r.from, today) ? today : r.from
    const to = r.to && isAfter(r.to, today) ? today : r.to
    setRange({ from, to })
  }

  const handleApply = () => {
    if (!range?.from || !range?.to) return
    setActivePresetKey("CUSTOM")
    setMode("preset")
    emitParams({ startDate: fmtApi(range.from), endDate: fmtApi(range.to) })
    setOpen(false)
  }

  const displayValue =
    range?.from && range?.to
      ? `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`
      : "Select range"

  return (
    <div className="flex flex-col gap-2 w-[320px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id="date-range" variant="outline" className={cn("justify-between font-normal w-full")}>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {displayValue}
            </div>
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="flex p-0 w-auto">
          {/* Sidebar preset */}
          <div className="flex flex-col border-r w-[180px] bg-muted/30">
            {PRESETS.map((preset) => {
              const active = activePresetKey === preset.key
              return (
                <button
                  key={preset.key}
                  onClick={() => handlePreset(preset)}
                  className={cn(
                    "text-left px-4 py-2 text-sm transition-all border-l-4 flex items-center justify-between",
                    active
                      ? "bg-orange-100 text-orange-700 border-orange-500 font-medium"
                      : "border-transparent hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{preset.label}</span>
                  {active && <span className="text-xs font-semibold">{preset.key}</span>}
                </button>
              )
            })}
          </div>

          {mode === "custom" && (
            <div className="p-3">
              <Calendar
                mode="range"
                selected={range}
                onSelect={handleSelectRange}
                numberOfMonths={2}
                toDate={today}
                disabled={{ after: today }}
                defaultMonth={today}
              />
              <div className="flex items-center justify-end gap-2 mt-3">
                <Button variant="ghost" onClick={() => { setMode("preset"); setActivePresetKey(defaultPreset.key) }}>
                  Cancel
                </Button>
                <Button onClick={handleApply} disabled={!range?.from || !range?.to}>
                  Apply
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
