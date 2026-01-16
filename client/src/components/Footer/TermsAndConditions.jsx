import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./legal.css";
import Right_ad from "../side-ad/Right_ad";
import Left_ad from "../side-ad/Left_ad";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
<Left_ad />
      <div className="legal-container">
        <h1>Terms & Conditions</h1>
        <p className="updated">Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using this platform, you agree to be bound by these
            Terms & Conditions.
          </p>
        </section>

        <section>
          <h2>2. Platform Role</h2>
          <p>
            We provide only a platform. Earnings depend solely on user activity,
            effort, and compliance with platform rules.
          </p>
        </section>

        <section>
          <h2>3. Earnings & Payments</h2>
          <ul>
            <li>Income is based on user work and engagement</li>
            <li>Withdrawals are processed to the user’s bank account</li>
            <li>Payments are settled on a monthly basis</li>
          </ul>
        </section>

        <section>
          <h2>4. Advertisements</h2>
          <p>
            Advertisements are essential to the platform. Using ad blockers may
            result in limited features, loss of earnings, or account suspension.
          </p>
        </section>

        <section>
          <h2>5. Airdrops & Points</h2>
          <p>
            Airdrop distribution is based on earning points. Point values may
            differ depending on device type (mobile or laptop) and usage behavior.
          </p>
        </section>

        <section>
          <h2>6. User Conduct</h2>
          <ul>
            <li>No misuse, automation, or fraudulent activity</li>
            <li>No attempt to manipulate ads or earnings</li>
            <li>Violation may lead to account termination</li>
          </ul>
        </section>

        <section>
          <h2>7. Data Usage</h2>
          <p>
            User and employee data may be used for development, analytics, and
            business purposes as described in the Privacy Policy.
          </p>
        </section>

        <section>
          <h2>8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms without prior notice.
          </p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>
            Terms may be updated at any time. Continued use means acceptance of
            revised terms.
          </p>
        </section>
      </div>
    <Right_ad />
      <Footer />
    </>
  );
};

export default TermsAndConditions;
