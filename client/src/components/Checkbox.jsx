import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

// Square checkbox from the bag mockups; `mixed` draws the "some selected" dash.
const Checkbox = ({ checked, mixed = false, onChange, label, className }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={mixed ? 'mixed' : checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={clsx(
      'grid shrink-0 place-items-center rounded-[2px] border text-accent',
      checked || mixed ? 'border-accent' : 'border-divider',
      className
    )}
  >
    {checked && <Check size={13} strokeWidth={2} />}
    {!checked && mixed && <span className="h-[1.5px] w-2 bg-current" />}
  </button>
);

export default Checkbox;
