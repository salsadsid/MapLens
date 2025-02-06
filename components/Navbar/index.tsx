"use client";
import styles from "@/styles/Navbar.module.scss";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Draw", path: "/draw" },
    { name: "Manage Polygons", path: "/manage-polygons" },
  ];

  return (
    <nav className={`${styles.navbar} bg-white shadow-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl uppercase tracking-wide font-bold text-[#4f46e5]"
          >
            🗺️ Maplens
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`${styles.navLink} px-3 py-2`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.hamburger} md:hidden ${
              isMenuOpen ? "active" : ""
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${styles.mobileMenu} ${isMenuOpen ? "open" : ""}`}
          style={{ display: isMenuOpen ? "block" : "none" }}
        >
          <div className="px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`${styles.navLink} block px-3 py-4 text-sm`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
