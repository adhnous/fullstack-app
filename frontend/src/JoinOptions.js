import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinOptions.css';

function JoinOptions() {
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  // Toggle Language Function
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  // Go Back Function
  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="options-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Page Title */}
      <h2>{language === 'ar' ? 'اختر لوحة التحكم' : 'Choose Your Dashboard'}</h2>

      {/* Menu Options */}
      <div className="menu-options">
        <button onClick={() => navigate('/admin-login')}>
          {language === 'ar' ? 'لوحة المسؤول' : 'Admin'}
        </button>
        <button onClick={() => navigate('/trainer-register')}>
          {language === 'ar' ? 'تسجيل المدرب' : 'Trainer'}
        </button>
        <button onClick={() => navigate('/trainee-register')}>
          {language === 'ar' ? 'تسجيل المتدرب' : 'Trainee'}
        </button>
      </div>

      {/* Back and Language Toggle Buttons */}
      <div className="button-container">
        <button className="back-button" onClick={goBack}>
          {language === 'ar' ? 'رجوع' : 'Back'}
        </button>
        <button className="toggle-language" onClick={toggleLanguage}>
          {language === 'ar' ? 'English' : 'التبديل إلى العربية'}
        </button>
      </div>
    </div>
  );
}

export default JoinOptions;
