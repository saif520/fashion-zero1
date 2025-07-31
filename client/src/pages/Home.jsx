import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Sliding Banner Component
const SlidingBanner = () => {
  const images = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sliding-banner">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index + 1}`}
          className={`banner-image ${index === currentIndex ? "active" : ""}`}
        />
      ))}
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Navbar />
       {/* Carousel at the top below Navbar */}
      <div className="home">
        {/* Hero Banner */}
        <SlidingBanner />
        <section className="hero">
          <div className="hero-content">
            <h1>Discover the Latest Trends</h1>
            <p>Shop the best styles for Men, Women, Kids & more</p>
            <Link to="/category/all" className="hero-btn">
              Shop Now
            </Link>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="categories">
          <h2>Explore Categories</h2>
          <div className="category-grid">
            <Link to="/category/all" className="category-card all">All</Link>
            <Link to="/category/clothing" className="category-card clothing">Clothing</Link>
            <Link to="/category/shoes" className="category-card shoes">Shoes</Link>
            <Link to="/category/shirts" className="category-card shirts">Shirts</Link>
            <Link to="/category/tshirts" className="category-card tshirts">T-Shirts</Link>
            <Link to="/category/jackets" className="category-card jackets">Jackets</Link>
            <Link to="/category/accessories" className="category-card accessories">Accessories</Link>
            <Link to="/category/electronics" className="category-card electronics">Electronics</Link>
            <Link to="/category/fitness" className="category-card fitness">Fitness</Link>
            <Link to="/category/homekitchen" className="category-card homekitchen">Home & Kitchen</Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="call-to-action">
          <h2>Don't Miss Out!</h2>
          <p>Check out our latest deals and offers.</p>
          <Link to="/offers" className="cta-btn">View Offers</Link>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
