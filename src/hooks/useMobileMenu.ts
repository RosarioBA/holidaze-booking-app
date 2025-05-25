/**
 * @file useMobileMenu.ts
 * @description Custom hook for managing mobile menu state and behavior
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to manage mobile menu state with outside click handling,
 * scroll locking, and location-based auto-closing
 * 
 * @param {string} [menuElementId='mobile-sidebar'] - ID of the menu element for click detection
 * @param {string} [toggleButtonId='mobile-menu-button'] - ID of the toggle button
 * @returns {[boolean, () => void, () => void]} Array containing isOpen state, toggle function, and close function
 */
export const useMobileMenu = (
  menuElementId: string = 'mobile-sidebar',
  toggleButtonId: string = 'mobile-menu-button'
) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Handle outside clicks to close menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && e.target instanceof HTMLElement) {
        const menu = document.getElementById(menuElementId);
        // Don't close if clicking on the menu or the toggle button
        if (menu && !menu.contains(e.target) && e.target.id !== toggleButtonId) {
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen, menuElementId, toggleButtonId]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);
  
  return [isOpen, toggleMenu, closeMenu] as const;
};

export default useMobileMenu;