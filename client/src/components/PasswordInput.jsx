import React, { useState } from 'react';

// Password field with the Show / Hide toggle from the auth mockups.
const PasswordInput = ({ id, value, onChange, autoComplete, className = '' }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        className={`input pr-16 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-accent-ink"
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordInput;
