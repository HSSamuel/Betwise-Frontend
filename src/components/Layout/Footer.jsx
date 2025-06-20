import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} BetWise. Built by HSSamuel.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Please bet responsibly. For help, visit responsible gambling sites.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
