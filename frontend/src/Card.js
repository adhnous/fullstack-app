import React from 'react';

function Card({ title, description, buttonText, onClick }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onClick}>{buttonText}</button>
    </div>
  );
}

export default Card;
