// src/components/settings/ToggleOption.tsx

/**
 * @file ToggleOption.tsx
 * @description Reusable toggle switch component for settings
 */

import React from 'react';

/**
 * Props for the ToggleOption component
 */
interface ToggleOptionProps {
  /** Title of the toggle option */
  title: string;
  /** Description text */
  description: string;
  /** Current toggle state */
  isEnabled: boolean;
  /** ID for the toggle input (used for label association) */
  id: string;
  /** Handler for toggle change */
  onToggle: () => void;
}

/**
 * A reusable toggle option component for settings pages
 * 
 * @param {ToggleOptionProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ToggleOption: React.FC<ToggleOptionProps> = ({
  title,
  description,
  isEnabled,
  id,
  onToggle
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded mb-4">
      <label htmlFor={id} className="flex-grow cursor-pointer">
        <h3 className="font-medium font-averia">{title}</h3>
        <p className="text-sm text-gray-600 font-light tracking-wide">
          {description}
        </p>
      </label>
      
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={isEnabled}
          onChange={onToggle}
          className="sr-only peer"
          aria-label={`Toggle ${title}`}
        />
        <span className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0081A7]"></span>
      </label>
    </div>
  );
};

export default ToggleOption;