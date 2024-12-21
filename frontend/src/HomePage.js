import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [language, setLanguage] = useState('ar'); // Default to Arabic
  const navigate = useNavigate(); // React Router navigation hook

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const goToMainPage = () => {
    navigate('/options'); // Navigate to the JoinOptions page
  };

  return (
    <div className="homepage">
      {/* Info Container with Glassmorphism */}
      <div className="info-container">
        <img
          src="./scr/university-logo.png"
          alt="University Logo"
          className="logo"
        />
        <h1>{language === 'ar' ? 'جامعة طرابلس' : 'University of Tripoli'}</h1>
        <p>
          {language === 'ar'
            ? `كلية تقنية المعلومات
            نظام إدارة أكاديمية جامعة طرابلس للفروسية
            مشروع مقدم لقسم هندسة البرمجيات لاستيفاء متطلبات درجة البكالوريوس
            إعداد: نهال محمد المبروك الجبير - رقم القيد: 2191807474
            الاء صالح سالم شامخ - رقم القيد: 2191809943
            بإشراف: د. امنة علي عبد السلام محمد`
            : `Faculty of Information Technology
            Tripoli University Equestrian Academy Management System
            A project submitted to the Software Engineering Department
            To fulfill the requirements for a Bachelor's Degree
            Prepared by: Nihal Mohammed Al-Mabrouk Al-Jabir - ID: 2191807474
            Ala Salah Salem Shamikh - ID: 2191809943
            Supervised by: Dr. Amna Ali Abdul-Salam Mohammed`}
        </p>

        {/* Buttons */}
        <div className="button-container">
          <button className="button primary" onClick={goToMainPage}>
            {language === 'ar' ? 'الانتقال إلى الصفحة الرئيسية' : 'Go to Main Page'}
          </button>
          <button className="button secondary" onClick={toggleLanguage}>
            {language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
