import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./legal.css";
import Left_ad from "../side-ad/Left_ad";
import Right_ad from "../side-ad/Right_ad";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
        <Left_ad />
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: {new Date().getFullYear()}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy explains how we collect, use, and protect user
            information on our platform. By using our services, you agree to the
            practices described in this policy.
          </p>
        </section>

        <section>
          <h2>2. Platform Purpose</h2>
          <p>
            We provide only a digital platform. Any income, rewards, or earnings
            depend entirely on the user’s activity, effort, and engagement on
            the platform.
          </p>
        </section>

        <section>
          <h2>3. Information We Collect</h2>
          <ul>
            <li>Basic user details such as name, email, and contact information</li>
            <li>Account activity, earning points, and usage data</li>
            <li>Device information (mobile or laptop)</li>
          </ul>
        </section>

        <section>
          <h2>4. Use of Information</h2>
          <p>
            User and employee information may be used for:
          </p>
          <ul>
            <li>Platform improvement and feature development</li>
            <li>Business analysis and growth</li>
            <li>Security, fraud prevention, and compliance</li>
          </ul>
        </section>

        <section>
          <h2>5. Advertisements & Tracking</h2>
          <p>
            Use of ad blockers may affect platform functionality and may lead to
            account restrictions or suspension, as advertisements are part of
            the platform’s earning system.
          </p>
        </section>

        <section>
          <h2>6. Airdrops & Reward Points</h2>
          <p>
            Airdrops are distributed based on earning points. Points may vary
            depending on device type (mobile or laptop) and user activity.
          </p>
        </section>

        <section>
          <h2>7. Data Security</h2>
          <p>
            We implement reasonable security measures to protect user data.
            However, no system is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section>
          <h2>8. Policy Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use
            of the platform means acceptance of the updated policy.
          </p>
        </section>
      </div>
    <Right_ad />
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
