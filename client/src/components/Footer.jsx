import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top Links Section */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Online Shopping</h4>
            <ul>
              <li><a href="/category/men">Men</a></li>
              <li><a href="/category/women">Women</a></li>
              <li><a href="/category/kids">Kids</a></li>
              <li><a href="/category/home-living">Home & Living</a></li>
              <li><a href="/category/beauty">Beauty</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Customer Policies</h4>
            <ul>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/return">Return Policy</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Customer Support</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Useful Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Information */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MyntraX. All rights reserved.</p>
          <p>Designed & Developed by Saifuddin Dhali</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
