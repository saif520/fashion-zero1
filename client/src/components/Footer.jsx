import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top Links Section */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Online Shopping</h4>
            <ul>
              <li>
                <Link to="/search?categories=Men">
                  Men
              </Link>
              </li>
              <li>
                <Link to="/search?categories=Women">
                  Women
              </Link>
              </li>
              <li>
                <Link to="/search?categories=Kids">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/search?categories=Beauty">
                  Beauty
                </Link>
              </li>
              <li>
                <Link to="/search?categories=Home%20%26%20Living">
                  Home & Living
                </Link>
              </li>
              <li><Link to="/search?categories=Art">
                  Art
              </Link></li>
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
          <p>&copy; {new Date().getFullYear()} FashionZero. All rights reserved.</p>
          <p>Designed & Developed by Saifuddin Dhali</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
