import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [language, setLanguage] = useState('en'); // Language toggle
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize navigation hook

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: email, password }),
      });

      const data = await response.json();
      setIsLoading(false); // Reset loading state

      if (data.success) {
        localStorage.setItem('token', data.token); // Store JWT token
        navigate('/admin-dashboard');
      } else {
        setError(data.message || (language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login error'));
      }
    } catch (error) {
      setIsLoading(false);
      setError(language === 'ar' ? 'خطأ في الخادم' : 'Server error');
    }
  };

  return (
    <div className="admin-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{language === 'ar' ? 'تسجيل دخول المشرف' : 'Admin Login'}</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter Admin Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading
              ? language === 'ar'
                ? 'جاري التحميل...'
                : 'Loading...'
              : language === 'ar'
              ? 'تسجيل الدخول'
              : 'Login'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="footer-buttons">
        <button onClick={toggleLanguage} className="language-btn">
          {language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        </button>
        <button onClick={() => navigate(-1)} className="back-btn">
          {language === 'ar' ? 'رجوع' : 'Back'}
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
