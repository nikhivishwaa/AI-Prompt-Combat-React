import React from "react";

function RulesScreen({ width = "50%" }) {
  return (
    <>
      <style>{style}</style>
      <section className="rules-section">
        <div className="rules-container" style={{ width }}>
          <h2>COMPETITION RULES</h2>
          <ul>
            <li>
              Participants must adhere to the given prompt conditions in Level
              1.
            </li>
            <li>
              Generated images in Level 2 must closely match the reference
              image.
            </li>
            <li>
              Any use of offensive or inappropriate content will lead to
              disqualification.
            </li>
            <li>Judges' decisions are final and binding.</li>
            <li>
              Participants should submit their entries within the given time
              frame.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

const style = `
/* Full Page Styling */
    .rules-section {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 20px;
        text-align: center;
    }

    /* Rules Box Styling */
    .rules-container {
        background: rgba(20, 20, 20, 0.9);
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        width: 50%;
        text-align: justify;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        color: #00EEEE;
    }

    .rules-container:hover {
        transform: scale(1.03);
        box-shadow: 0 10px 20px rgba(0, 255, 255, 0.4);
    }

    /* Title Styling */
    .rules-container h2 {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #00FFFF;
    }

    /* List Styling */
    .rules-container ul {
        list-style-type: none;
        padding: 0;
    }

    .rules-container li {
        font-size: 14px;
        background: rgba(0, 255, 255, 0.1);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        transition: 0.3s;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        color: #00FFFF;
    }

    /* Adding Icons */
    .rules-container li::before {
        content: "✔";
        color: #FFA726;
        font-weight: bold;
        font-size: 20px;
    }

    .rules-container li:hover {
        background: rgba(0, 255, 255, 0.3);
        color: #000;
        transform: scale(1.02);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
        .rules-container {
            width: 70%;
            padding: 30px;
        }
    }

    @media (max-width: 768px) {
        .rules-container {
            width: 85%;
            padding: 25px;
        }

        .rules-container h2 {
            font-size: 24px;
        }

        .rules-container li {
            font-size: 16px;
            padding: 10px;
        }
    }

    @media (max-width: 480px) {
        .rules-container {
            width: 95%;
            padding: 20px;
        }

        .rules-container h2 {
            font-size: 22px;
        }

        .rules-container li {
            font-size: 14px;
            padding: 8px;
        }
    }
`;

export default RulesScreen;
