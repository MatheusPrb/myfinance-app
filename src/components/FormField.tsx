import type { InputHTMLAttributes } from 'react'

type FormFieldProps = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete?: string
  disabled?: boolean
  hint?: string
  multiline?: boolean
  rows?: number
  placeholder?: string
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'min' | 'max' | 'step' | 'inputMode'>

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  disabled,
  hint,
  multiline,
  rows = 3,
  placeholder,
  min,
  max,
  step,
  inputMode,
}: FormFieldProps) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          inputMode={inputMode}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
