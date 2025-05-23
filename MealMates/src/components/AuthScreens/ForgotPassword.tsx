import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailSent(false);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      console.log('Password reset email sent');
    } catch (error: any) {
      setError('Failed to send password reset email');
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-tab-pw">
          Forgot Password
      </div>
      
      {error && <div className="auth-error">{error}</div>}
      {emailSent && <div className="auth-success">Password reset email sent successfully!</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="auth-button primary">
          Reset Password
        </button>
        
        <div className="auth-footer">
          <Link to="/">Back to login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
