// src/components/layout/Footer.tsx
const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {currentYear} Holidaze. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;