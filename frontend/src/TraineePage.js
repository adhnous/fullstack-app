import React, { useState } from 'react';
import './SharedBackground.css';
import Card from './Card'; // Import reusable Card component

function TraineePage() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="shared-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2>{language === 'ar' ? 'نظام إدارة الصالة الرياضية' : 'Gym Management System'}</h2>
      </nav>

      {/* Welcome Message */}
      <h2 style={{ marginTop: '80px' }}>
        {language === 'ar' ? 'مرحبًا، المتدرب!' : 'Welcome, Trainee!'}
      </h2>

      {/* Card Container */}
      <div className="card-container">
        <Card
          title={language === 'ar' ? 'جلسات التدريب' : 'Training Sessions'}
          description={
            language === 'ar'
              ? 'اعرض جلسات التدريب القادمة وقم بجدولة جلسات جديدة.'
              : 'View your upcoming training sessions and schedule new ones.'
          }
          buttonText={language === 'ar' ? 'عرض الجلسات' : 'View Sessions'}
          onClick={() => alert('Navigating to Training Sessions')}
        />

        <Card
          title={language === 'ar' ? 'تتبع التقدم' : 'Progress Tracking'}
          description={
            language === 'ar'
              ? 'تتبع تقدمك وإنجازاتك في اللياقة البدنية.'
              : 'Track your fitness progress and achievements.'
          }
          buttonText={language === 'ar' ? 'عرض التقدم' : 'View Progress'}
          onClick={() => alert('Navigating to Progress Tracking')}
        />

        <Card
          title={language === 'ar' ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
          description={
            language === 'ar'
              ? 'قم بتحديث معلوماتك الشخصية وتفضيلاتك.'
              : 'Update your personal information and preferences.'
          }
          buttonText={language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
          onClick={() => alert('Navigating to Profile Settings')}
        />
      </div>

      {/* Language Toggle */}
      <button className="language-toggle" onClick={toggleLanguage}>
        {language === 'ar' ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
      </button>
    </div>
  );
}

export default TraineePage;
