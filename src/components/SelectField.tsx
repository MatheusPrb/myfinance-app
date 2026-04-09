type Option = { value: string; label: string }

type SelectFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  disabled?: boolean
  error?: string
  hint?: string
  emptyOption?: Option
  required?: boolean
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
  error,
  hint,
  emptyOption,
  required,
}: SelectFieldProps) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        {emptyOption ? (
          <option value={emptyOption.value}>{emptyOption.label}</option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
