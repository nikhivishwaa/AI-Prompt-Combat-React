import React from "react";

function Footer() {
  return (
    <>
    <style>{style}</style>
    <footer className="footer">
      <p>🔥 Fuel the Future of AI! Innovate, Compete, and Win.</p>
    </footer>
    </>
  );
}

const style = `
/* Footer */
        .footer {
            background: rgba(20, 20, 20, 0.9);
            color: #00FFFF;
            text-align: center;
            padding: 10px 0;
            width: 100%;
            border-top: 2px solid #00FFFF;
            margin-top: auto;
        }
`

export default Footer;
