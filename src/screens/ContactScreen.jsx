import React from "react";
import { Link } from "react-router-dom";

function ContactScreen() {
  return (
    <>
      <style>{style}</style>

      <div className="contact-container">
        <h1 className="contact-title">Contact & Support</h1>
        <p>Follow us for regular updates</p>

        <div className="social-icons">
          <a
            href="https://www.instagram.com/official_kagglekoders_sistec/profilecard/?igsh=dTkxdWljdXNqdzFx"
            target="_blank"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
              alt="Instagram"
            />
          </a>
          <a href="mailto:kagglekoders@gmail.com">
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
              alt="Gmail"
            />
          </a>
        </div>

        <div className="contact-card-container">
          <div className="contact-card">
            <h3>Helpdesk</h3>
            <p>
              Shubh Narayan Dubey
              <br />
              +91 6387183446
            </p>
            {/* <a href="https://wa.me/918435627811" className="whatsapp-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp"/>
            </=> */}
            <p>
              Dharmendra Singh Parmar <br />
              +91 6387183446
            </p>
          </div>

          <div className="contact-card">
            <h3>Event Coordinators</h3>
            <p>
              Aashutosh Tiwari
              <br />
              +91 8435627811
            </p>
            <p>
              Pal Priya Sandeep Kumar
              <br />
              +91 737971251
            </p>
            {/* <a href="https://wa.me/91737971251" className="whatsapp-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp"/>
            </=> */}
            <p>
              Nikhil Vishwakarma
              <br />
              +91 9685269754
            </p>
          </div>

          <div className="contact-card">
            <h3>Faculty Coordinators</h3>
            <p>
              Madhuri Walia
              <br />
              +91 8770967274
            </p>
            {/* <a href="https://wa.me/919753799418" className="whatsapp-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp"/>
            </=> */}
          </div>
        </div>
      </div>
    </>
  );
}

const style = `
.contact-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 150px); /* Account for header and footer */
        padding: 40px 0;
        overflow-y: auto; /* Enable vertical scrolling when needed */
    }

    .contact-title {
        font-size: 2.5rem;
        font-weight: bold;
        text-transform: uppercase;
        color: #00FFFF; /* Match primary theme */
        text-shadow: 2px 2px 15px rgba(0, 191, 255, 0.7);
    }

    .social-icons {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 15px;
    }

    .social-icons a {
        background:rgb(0, 5, 5); /* Adjusted to match home */
        padding: 12px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        box-shadow: 0px 0px 10px rgba(0, 191, 255, 0.4);
    }

    .social-icons a:hover {
        transform: scale(1.2);
        box-shadow: 0px 0px 20px rgba(0, 191, 255, 0.8);
    }

    .social-icons img {
        width: 28px;
        height: 28px;
    }

    .contact-card-container {
        display: flex;
        justify-content: center;
        gap: 25px;
        flex-wrap: wrap;
        margin-top: 40px;
    }

    .contact-card {
        background: #1e1e1e; /* Adjusted to match home */
        padding: 25px;
        border-radius: 12px;
        width: 280px;
        text-align: center;
        box-shadow: 0px 0px 15px rgba(0, 191, 255, 0.3);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }

    .contact-card:hover {
        transform: translateY(-5px);
        box-shadow: 0px 0px 25px rgba(0, 191, 255, 0.6);
    }

    .contact-card h3 {
        color: #00FFFF;
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    .contact-card p {
        font-size: 1rem;
        margin-bottom: 10px;
    }

    .whatsapp-icon {
        display: inline-block;
        margin-top: 10px;
        transition: transform 0.3s ease-in-out;
    }

    .whatsapp-icon:hover {
        transform: scale(1.2);
    }

    .whatsapp-icon img {
        width: 32px;
        height: 32px;
    }

    @media (max-width: 768px) {
        .contact-title {
            font-size: 2rem;
        }

        .contact-card {
            width: 90%;
        }
    }
`;

export default ContactScreen;
