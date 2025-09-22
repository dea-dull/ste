import React, { useState } from 'react';
import styles from './OTPModal.module.css';

const OTPModal = ({ email, onClose, onVerify, onResend }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2>Verify your account</h2>
        <p>
          Enter the 6-digit code sent to <strong>{email}</strong>. 
          This code is valid for the next 10 minutes.
        </p>

        <div className={styles.otpInputs}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              className={styles.otpBox}
            />
          ))}
        </div>

        <button className={styles.verifyBtn} onClick={() => onVerify(otp.join(""))}>
          Verify
        </button>

        <p className={styles.resend}>
          Didn’t get the code? <span onClick={onResend}>Resend code</span>
        </p>

        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default OTPModal;

