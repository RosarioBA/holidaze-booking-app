/**
 * @file useForm.ts
 * @description Custom hook for form state management with validation
 */

import { useState, ChangeEvent, FormEvent } from 'react';

/**
 * Interface for form validation errors
 */
interface FormErrors {
  /** Keys match form field names, values are error messages */
  [key: string]: string;
}

/**
 * Return type for the useForm hook
 */
interface UseFormReturn<T> {
  /** Current form values */
  values: T;
  /** Validation errors for form fields */
  errors: FormErrors;
  /** Function to handle input changes */
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Function to handle form submission with validation */
  handleSubmit: (onSubmit: () => void) => (e: FormEvent<HTMLFormElement>) => void;
  /** Function to manually update form values */
  setValues: React.Dispatch<React.SetStateAction<T>>;
}

/**
 * Custom hook for managing form state, validation, and submission
 * Provides input change handling, validation, and submission functionality
 * 
 * @template T - Type of the form values object
 * @param {T} initialValues - Initial values for the form fields
 * @returns {UseFormReturn<T>} Form state and handlers
 */
export function useForm<T extends Record<string, any>>(initialValues: T): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  
  /**
   * Handles changes to form input elements
   * Updates the values state and clears errors for the changed field
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  /**
   * Validates form values against rules
   * 
   * @returns {boolean} True if validation passes, false otherwise
   */
  const validate = () => {
    const newErrors: FormErrors = {};
    
    // Add validation rules here based on your requirements
    Object.entries(values).forEach(([key, value]) => {
      // Required field validation
      if (value === '') {
        newErrors[key] = `${key} is required`;
      }
      
      // Email validation for Noroff student emails
      if (key === 'email' && typeof value === 'string') {
        const isValidEmail = /^[^\s@]+@stud\.noroff\.no$/.test(value);
        if (!isValidEmail) {
          newErrors[key] = 'Email must be a valid stud.noroff.no address';
        }
      }
      
      // Password length validation
      if (key === 'password' && typeof value === 'string' && value.length < 8) {
        newErrors[key] = 'Password must be at least 8 characters';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Creates a form submit handler that validates before calling onSubmit
   * 
   * @param {Function} onSubmit - Function to call if validation passes
   * @returns {(e: FormEvent<HTMLFormElement>) => void} Submit event handler
   */
  const handleSubmit = (onSubmit: () => void) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit();
    }
  };
  
  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
  };
}