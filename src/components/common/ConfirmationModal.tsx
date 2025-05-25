/**
 * @file ConfirmationModal.tsx
 * @description Reusable confirmation modal component with customizable text and actions
 */

import React from 'react';

/**
 * Props for the ConfirmationModal component
 */
interface ConfirmationModalProps {
  /** Title displayed at the top of the modal */
  title: string;
  /** Main message explaining the confirmation action */
  message: string;
  /** Text for the confirm button */
  confirmText: string;
  /** Text for the cancel button */
  cancelText: string;
  /** Whether an action is currently being processed */
  isLoading?: boolean;
  /** Function to call when the user confirms the action */
  onConfirm: () => void;
  /** Function to call when the user cancels the action */
  onCancel: () => void;
}

/**
 * Generic confirmation modal for any action that requires user confirmation
 * 
 * @param {ConfirmationModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;