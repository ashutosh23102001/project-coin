
import React, { useState } from "react";

import EmailVerification from "./EmailVerification";
// import PhoneVerification from "./PhoneVerification";
import Address from "./Address";

import "../sub.css";

const Contact = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  return (
    <div className="settings-form">
      <h3>Contact Details</h3>

      <EmailVerification
        email={form.email}
        setEmail={email => setForm({ ...form, email })}
      />
{/* 
      <PhoneVerification
        phone={form.phone}
        setPhone={phone => setForm({ ...form, phone })}
      /> */}

      <Address form={form} setForm={setForm} />
    </div>
  );
};

export default Contact;
