// src/hooks/useForm.ts
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  
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
  
  const validate = () => {
    const newErrors: FormErrors = {};
    
    // Add validation rules here based on your requirements
    Object.entries(values).forEach(([key, value]) => {
      if (value === '') {
        newErrors[key] = `${key} is required`;
      }
      
      if (key === 'email' && typeof value === 'string') {
        const isValidEmail = /^[^\s@]+@stud\.noroff\.no$/.test(value);
        if (!isValidEmail) {
          newErrors[key] = 'Email must be a valid stud.noroff.no address';
        }
      }
      
      if (key === 'password' && typeof value === 'string' && value.length < 8) {
        newErrors[key] = 'Password must be at least 8 characters';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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