import React, { useState } from 'react';
import './Register.css';

function TraineeRegister() {
  const [mode, setMode] = useState('register'); // Toggle between 'register' and 'login'
  const [language, setLanguage] = useState('en'); // Toggle between Arabic and English
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleMode = () => {
    setMode(mode === 'register' ? 'login' : 'register');
    setSuccess('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'register') {
      setSuccess(
        language === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration successful!'
      );
    } else {
      setSuccess(
        language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!'
      );
    }
  };

  return (
    <div className="trainee-register-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="title">
        {language === 'ar'
          ? mode === 'register'
            ? 'تسجيل المتدرب'
            : 'تسجيل الدخول للمتدرب'
          : mode === 'register'
          ? 'Trainee Registration'
          : 'Trainee Login'}
      </h2>

      <div className="form-container">
        {/* Success or Error Messages */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Toggle Between Login and Register */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={
              language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter your email'
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {mode === 'register' && (
            <input
              type="text"
              placeholder={
                language === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder={
              language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="action-btn">
            {language === 'ar'
              ? mode === 'register'
                ? 'تسجيل'
                : 'تسجيل الدخول'
              : mode === 'register'
              ? 'Register'
              : 'Login'}
          </button>
        </form>

        {/* Mode Toggle */}
        <button className="mode-toggle" onClick={toggleMode}>
          {language === 'ar'
            ? mode === 'register'
              ? 'لديك حساب بالفعل؟ تسجيل الدخول'
              : 'ليس لديك حساب؟ تسجيل'
            : mode === 'register'
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </div>

      {/* Language Toggle */}
      <button className="language-toggle" onClick={toggleLanguage}>
        {language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      </button>
    </div>
  );
}

export default TraineeRegister;
