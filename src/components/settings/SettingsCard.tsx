// src/components/settings/SettingsCard.tsx

/**
 * @file SettingsCard.tsx
 * @description Card component for grouping related settings
 */

import React, { ReactNode } from 'react';

/**
 * Props for the SettingsCard component
 */
interface SettingsCardProps {
  /** Card title */
  title: string;
  /** Card content */
  children: ReactNode;
}

/**
 * A container card for grouping related settings
 * 
 * @param {SettingsCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const SettingsCard: React.FC<SettingsCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="border-b border-gray-200 px-6 py-4 font-semibold font-averia">{title}</h2>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsCard;