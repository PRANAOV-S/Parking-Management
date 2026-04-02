import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="footer-container">
            <div className="footer-content container">
                <div className="footer-top">
                    {/* Brand & Contact Section */}
                    <div className="footer-brand-section">
                        <div className="footer-logo">
                            <img src={logo} alt="VDart Logo" className="footer-logo-img" />
                        </div>

                        <div className="contact-info">
                            <h4 className="contact-heading">Contact us</h4>
                            <div className="contact-item">
                                <span className="icon">📍</span>
                                <span>VDart, 30, Chennai - Theni Hwy, Mannarpuram</span>
                            </div>
                            <div className="contact-row">
                                <div className="contact-item">
                                    <span className="icon">📞</span>
                                    <span>+91 99445 48333</span>
                                </div>
                                <div className="contact-item">
                                    <span className="icon">✉️</span>
                                    <span>info@vdartacademy.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="footer-links-group">
                        <div className="footer-column">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Guide</a></li>
                                <li><a href="#">Gallery</a></li>
                                <li><a href="#">Halls</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Social Links</h4>
                            <ul>
                                <li><a href="#">Instagram</a></li>
                                <li><a href="#">LinkedIn</a></li>
                                <li><a href="#">Twitter</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll to top">
                        ↑
                    </button>
                    <div className="copyright-text">
                        © VDart Academy 2025. All Rights Reserved. <a href="#">Disclaimer</a> | <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
