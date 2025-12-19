import React from 'react';
import { 
    FaFacebookF, 
    FaTwitter, 
    FaInstagram, 
    FaLinkedinIn, 
    FaYoutube 
} from 'react-icons/fa';
import './Footer.css'; 

// Component for a single column of links
const LinkColumn = ({ title, links }) => (
    <div className="footer-column">
        <h4>{title}</h4>
        <ul className="footer-links">
            {links.map((link, index) => (
                <li key={index}><a href={link.url}>{link.text}</a></li>
            ))}
        </ul>
    </div>
);

// Main Footer Component
const Footer = () => {
    // Data structure for the link columns
    const columnsData = [
        {
            title: "Links",
            links: [
                { text: "Home", url: "#home" },
                { text: "Contact", url: "#contact" },
                { text: "About Us", url: "#about" },
                { text: "Get Started", url: "#get-started" },
            ]
        },
        {
            title: "Services",
            links: [
                { text: "App Design", url: "#app-design" },
                { text: "Web Design", url: "#web-design" },
                { text: "Logo Design", url: "#logo-design" },
                { text: "Banner Design", url: "#banner-design" },
            ]
        },
        {
            title: "Other services",
            links: [
                { text: "SEO", url: "#seo" },
                { text: "Content Marketing", url: "#content-marketing" },
                { text: "Prints", url: "#prints" },
                { text: "Social Media", url: "#social-media" },
            ]
        },
    ];

    return (
        <footer className="footer-container">
            {/* TOP SECTION: Logo and Social Icons */}
            <div className="footer-top">
                <div className="footer-logo">Learning Robo</div>
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon icon-facebook"><FaFacebookF /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon icon-twitter"><FaTwitter /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon icon-instagram"><FaInstagram /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon icon-linkedin"><FaLinkedinIn /></a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon icon-youtube"><FaYoutube /></a>
                </div>
            </div>

            {/* MIDDLE SECTION: Link Columns and Contact */}
            <div className="footer-middle">
                {/* Dynamically render link columns */}
                {columnsData.map((column, index) => (
                    <LinkColumn key={index} title={column.title} links={column.links} />
                ))}

                {/* Contact Column (Manually coded for unique structure) */}
                <div className="footer-column contact-info">
                    <h4>Contact</h4>
                    <p>+91 88xxxxxxx</p>
                    <p>+91 88xxxxxxx</p>
                    <p><a href="mailto:example@gmail.com">example@gmail.com</a></p>
                </div>
            </div>

            {/* BOTTOM SECTION: Copyright and Policy */}
            <div className="footer-bottom">
                <span>Copyright &copy; 2021 learningrobo</span>
                <div className="made-with">
                    <a href="#privacy">Privacy policy</a>
                    <span>Made with <span style={{ color: 'red' }}>&hearts;</span> by Learning Robo</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;