import React from 'react';

const DateInput = ({ label, value, onChange }) => {
  return (
    <div className="w-1/4">
      <label className="block text-lg mb-2">{label}</label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

export default DateInput;
