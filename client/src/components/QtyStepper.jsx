import React from 'react';
import { clsx } from 'clsx';

const QtyStepper = ({ value, onChange, min = 1, max = 99, className, label = 'Quantity' }) => (
  <div role="group" aria-label={label} className={clsx('flex items-center rounded-md border border-divider', className)}>
    <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)} className="btn btn-icon">
      −
    </button>
    <span className="w-7 text-center tabular-nums" aria-live="polite">{value}</span>
    <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className="btn btn-icon">
      +
    </button>
  </div>
);

export default QtyStepper;
