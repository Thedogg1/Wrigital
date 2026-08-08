'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import {
  addMonths,
  daysInMonth,
  formatMonthYear,
  formatUkLongDate,
  formatUkLongDateFromDate,
  isSelectableWorkingDay,
  isWeekday,
  maxSelectableCalendarDay,
  minSelectableDate,
  mondayBasedWeekday,
  parseIsoDate,
  sameMonth,
  startOfLocalDay,
  toIsoDate,
} from '@/lib/brochure/dates';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

type BrochureDatePickerProps = {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  labelledBy?: string;
};

type Cell = {
  date: Date;
  iso: string;
  inMonth: boolean;
  selectable: boolean;
};

function buildMonthCells(view: Date, now: Date): Cell[] {
  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1);
  const leading = mondayBasedWeekday(first);
  const totalDays = daysInMonth(year, month);
  const cells: Cell[] = [];

  for (let i = 0; i < leading; i++) {
    const date = new Date(year, month, 1 - (leading - i));
    const iso = toIsoDate(date);
    cells.push({
      date,
      iso,
      inMonth: false,
      selectable: isSelectableWorkingDay(iso, now),
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const iso = toIsoDate(date);
    cells.push({
      date,
      iso,
      inMonth: true,
      selectable: isSelectableWorkingDay(iso, now),
    });
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const date = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate() + 1,
    );
    const iso = toIsoDate(date);
    cells.push({
      date,
      iso,
      inMonth: false,
      selectable: isSelectableWorkingDay(iso, now),
    });
  }

  return cells;
}

function firstSelectableIso(cells: Cell[]): string | null {
  return cells.find((c) => c.selectable)?.iso ?? null;
}

export function BrochureDatePicker({
  id,
  value,
  onChange,
  disabled = false,
  invalid = false,
  labelledBy,
}: BrochureDatePickerProps) {
  const now = useMemo(() => new Date(), []);
  const minDate = useMemo(() => minSelectableDate(now), [now]);
  const maxDate = useMemo(() => maxSelectableCalendarDay(now), [now]);
  const minMonth = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
    [now],
  );
  const maxMonth = useMemo(
    () => new Date(maxDate.getFullYear(), maxDate.getMonth(), 1),
    [maxDate],
  );

  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const selected = value ? parseIsoDate(value) : null;
    if (selected) return new Date(selected.getFullYear(), selected.getMonth(), 1);
    return new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  });
  const [focusIso, setFocusIso] = useState<string>(
    () => value || toIsoDate(minDate),
  );

  const cells = useMemo(
    () => buildMonthCells(viewMonth, now),
    [viewMonth, now],
  );

  const canGoBack = viewMonth.getTime() > minMonth.getTime();
  const canGoForward = viewMonth.getTime() < maxMonth.getTime();

  const displayValue = value ? formatUkLongDate(value) : 'Select a day';

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openPicker = useCallback(() => {
    const preferred =
      (value && isSelectableWorkingDay(value, now) && value) ||
      toIsoDate(minDate);
    const preferredDate = parseIsoDate(preferred) ?? minDate;
    setViewMonth(
      new Date(preferredDate.getFullYear(), preferredDate.getMonth(), 1),
    );
    setFocusIso(preferred);
    setOpen(true);
  }, [value, now, minDate]);

  const selectDate = useCallback(
    (iso: string) => {
      if (!isSelectableWorkingDay(iso, now)) return;
      onChange(iso);
      setFocusIso(iso);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [now, onChange],
  );

  const moveFocus = useCallback(
    (deltaDays: number) => {
      const current = parseIsoDate(focusIso) ?? minDate;
      let cursor = startOfLocalDay(current);
      for (let guard = 0; guard < 120; guard++) {
        cursor = new Date(cursor.getTime() + deltaDays * 24 * 60 * 60 * 1000);
        const iso = toIsoDate(cursor);
        if (isSelectableWorkingDay(iso, now)) {
          setFocusIso(iso);
          if (!sameMonth(cursor, viewMonth)) {
            setViewMonth(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
          }
          return;
        }
        if (cursor.getTime() < minDate.getTime() && deltaDays < 0) return;
        if (cursor.getTime() > maxDate.getTime() && deltaDays > 0) return;
      }
    },
    [focusIso, minDate, maxDate, now, viewMonth],
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(-7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(7);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectDate(focusIso);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Home': {
        event.preventDefault();
        const first = firstSelectableIso(cells);
        if (first) setFocusIso(first);
        break;
      }
      case 'End': {
        event.preventDefault();
        const last = [...cells].reverse().find((c) => c.selectable)?.iso;
        if (last) setFocusIso(last);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]`)
      ?.focus();
  }, [focusIso, open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={labelledBy}
        onClick={() => {
          if (disabled) return;
          if (open) {
            setOpen(false);
            return;
          }
          openPicker();
        }}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-transparent px-3 text-left text-base transition-colors',
          'hover:border-[var(--color-border-strong)] focus-visible:border-[var(--focus-ring-color)]',
          invalid && 'border-[var(--color-critical)]',
          disabled && 'cursor-not-allowed opacity-50',
          value
            ? 'text-[var(--color-text-primary)]'
            : 'text-[var(--color-text-secondary)]',
        )}
      >
        <span>{displayValue}</span>
        <span aria-hidden className="text-[var(--color-text-secondary)]">
          ▾
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={listboxId}
          role="dialog"
          aria-modal="false"
          aria-label="Choose a day for a call"
          className="absolute z-20 mt-2 w-full min-w-[18rem] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3 shadow-[var(--shadow-overlay)]"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canGoBack}
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              className="inline-flex size-9 items-center justify-center rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ‹
            </button>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              {formatMonthYear(viewMonth)}
            </p>
            <button
              type="button"
              aria-label="Next month"
              disabled={!canGoForward}
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="inline-flex size-9 items-center justify-center rounded-lg text-[var(--color-primary)] hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ›
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--color-text-secondary)]">
            {WEEKDAYS.map((label) => (
              <span key={label} aria-hidden>
                {label}
              </span>
            ))}
          </div>

          <div
            role="grid"
            aria-label={formatMonthYear(viewMonth)}
            className="grid grid-cols-7 gap-1"
            onKeyDown={onGridKeyDown}
          >
            {cells.map((cell) => {
              const selected = value === cell.iso;
              const focused = focusIso === cell.iso;
              const muted =
                !cell.selectable || !cell.inMonth || !isWeekday(cell.date);

              return (
                <button
                  key={cell.iso + String(cell.inMonth)}
                  type="button"
                  role="gridcell"
                  data-iso={cell.iso}
                  tabIndex={focused ? 0 : -1}
                  aria-label={formatUkLongDateFromDate(cell.date)}
                  aria-selected={selected}
                  disabled={!cell.selectable}
                  onClick={() => selectDate(cell.iso)}
                  onFocus={() => setFocusIso(cell.iso)}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-lg text-sm transition-colors',
                    muted &&
                      'cursor-default text-[var(--color-text-secondary)]/40',
                    cell.selectable &&
                      !selected &&
                      'text-[var(--color-primary)] hover:bg-[var(--color-surface)]',
                    selected &&
                      'bg-[var(--color-accent)] font-semibold text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-strong)]',
                    focused &&
                      !selected &&
                      'ring-2 ring-[var(--focus-ring-color)] ring-offset-1',
                  )}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
