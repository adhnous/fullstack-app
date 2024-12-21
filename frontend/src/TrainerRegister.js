import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrainerRegister.css';

function TrainerRegister() {
  const [mode, setMode] = useState('register'); // Register or login mode
  const [language, setLanguage] = useState('en'); // Language toggle (English/Arabic)
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // Distinguish error from success
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Clear inputs and messages on mode change
  useEffect(() => {
    setEmail('');
    setUsername('');
    setPassword('');
    setMessage('');
    setIsError(false);
  }, [mode]);

  // Toggle between English and Arabic
  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));

  // Toggle between registration and login modes
  const toggleMode = () => setMode((prev) => (prev === 'register' ? 'login' : 'register'));

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const url =
      mode === 'register'
        ? 'http://localhost:5000/api/register'
        : 'http://localhost:5000/api/login';

    const payload =
      mode === 'register'
        ? { email, username, password, role: 'trainer' }
        : { emailOrUsername: email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setMessage(
          language === 'ar'
            ? mode === 'register'
              ? 'تم التسجيل بنجاح!'
              : 'تم تسجيل الدخول بنجاح!'
            : mode === 'register'
            ? 'Registration successful!'
            : 'Login successful!'
        );
        setIsError(false);

        // Redirect after successful login
        if (mode === 'login') {
          localStorage.setItem('token', data.token); // Save token to local storage
          if (data.role === 'trainer') {
            navigate('/trainer-dashboard', { state: { username: data.username } });
          } else {
            setMessage(
              language === 'ar'
                ? 'دور المستخدم غير صحيح'
                : 'Incorrect user role for this login.'
            );
            setIsError(true);
          }
        }
      } else {
        setMessage(data.message || (language === 'ar' ? 'خطأ في العملية' : 'An error occurred'));
        setIsError(true);
      }
    } catch (error) {
      setLoading(false);
      setMessage(language === 'ar' ? 'خطأ في الخادم. حاول لاحقًا.' : 'Server error. Try again later.');
      setIsError(true);
    }
  };

  return (
    <div className="trainer-register-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="title">
        {language === 'ar'
          ? mode === 'register'
            ? 'تسجيل المدرب'
            : 'تسجيل الدخول للمدرب'
          : mode === 'register'
          ? 'Trainer Registration'
          : 'Trainer Login'}
      </h2>

      <div className="form-container">
        {message && (
          <p className={`message ${isError ? 'error-message' : 'success-message'}`}>{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter your email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {mode === 'register' && (
            <input
              type="text"
              placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="action-btn" disabled={loading}>
            {loading
              ? language === 'ar'
                ? 'جاري المعالجة...'
                : 'Processing...'
              : language === 'ar'
              ? mode === 'register'
                ? 'تسجيل'
                : 'تسجيل الدخول'
              : mode === 'register'
              ? 'Register'
              : 'Login'}
          </button>
        </form>

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

      <button className="language-toggle" onClick={toggleLanguage}>
        {language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      </button>
    </div>
  );
}

export default TrainerRegister;
