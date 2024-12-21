import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For back button navigation
import './Dashboard.css';

function AdminDashboard() {
  const [language, setLanguage] = useState('en'); // Language toggle state
  const [users, setUsers] = useState([]); // State for user data
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [usersPerPage] = useState(10); // Number of users per page
  const [error, setError] = useState(null); // Error state
  const [editMode, setEditMode] = useState({}); // Track which card is in edit mode

  const navigate = useNavigate(); // Back button navigation

  const roleTranslations = {
    admin: language === 'ar' ? 'مشرف' : 'Admin',
    trainer: language === 'ar' ? 'مدرب' : 'Trainer',
    trainee: language === 'ar' ? 'متدرب' : 'Trainee',
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin-dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.data.users);
      } catch (err) {
        setError(language === 'ar' ? 'خطأ في جلب البيانات.' : 'Error fetching data.');
        console.error(err);
      }
    };

    fetchData();
  }, [language]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditToggle = (userId) => {
    setEditMode((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const handleInputChange = (userId, field, value) => {
    setUsers((prevState) =>
      prevState.map((user) =>
        user._id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  const handleSave = async (userId) => {
    const updatedUser = users.find((user) => user._id === userId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMode((prevState) => ({ ...prevState, [userId]: false }));
      alert(language === 'ar' ? 'تم تحديث المستخدم بنجاح!' : 'User updated successfully!');
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'خطأ في تحديث المستخدم.' : 'Error updating user.');
    }
  };

  return (
    <div className="admin-dashboard" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="navbar">
        <h2>{language === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Dashboard'}</h2>
        <div className="nav-buttons">
          <button onClick={toggleLanguage} className="language-toggle">
            {language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          </button>
          <button onClick={() => navigate(-1)} className="back-button">
            {language === 'ar' ? 'رجوع' : 'Back'}
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h3>{language === 'ar' ? 'مرحبًا بك، مشرف!' : 'Welcome, Admin!'}</h3>

        {error && <p className="error-message">{error}</p>}

        {currentUsers.length > 0 ? (
          <div className="card-container">
            {currentUsers.map((user) => (
              <div key={user._id} className="card">
                {editMode[user._id] ? (
                  <>
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) => handleInputChange(user._id, 'username', e.target.value)}
                      className="edit-input"
                    />
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => handleInputChange(user._id, 'email', e.target.value)}
                      className="edit-input"
                    />
                    <select
                      value={user.role}
                      onChange={(e) => handleInputChange(user._id, 'role', e.target.value)}
                      className="edit-select"
                    >
                      <option value="admin">{roleTranslations.admin}</option>
                      <option value="trainer">{roleTranslations.trainer}</option>
                      <option value="trainee">{roleTranslations.trainee}</option>
                    </select>
                    <button onClick={() => handleSave(user._id)} className="save-button">
                      {language === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                  </>
                ) : (
                  <>
                    <h4>
                      {language === 'ar' ? 'اسم المستخدم:' : 'Username:'} {user.username}
                    </h4>
                    <p>
                      {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'} {user.email}
                    </p>
                    <p>
                      {language === 'ar' ? 'الدور:' : 'Role:'} {roleTranslations[user.role]}
                    </p>
                    <button
                      onClick={() => handleEditToggle(user._id)}
                      className="edit-button"
                    >
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          !error && <p>{language === 'ar' ? 'لا يوجد مستخدمون.' : 'No users found.'}</p>
        )}

        <div className="pagination">
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
