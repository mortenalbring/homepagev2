import React from 'react';
import './App.css';

function App() {
  return (
      <div className="container">
        <img src="/profile.jpg" alt="Morten Albring" className="profile-img"/>
        <h1>Morten Albring</h1>
        <p>Software Engineer | Open Source Contributor</p>
        <div className="links">
          <a href="https://github.com/mortenalbring" className="link" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/mortenalbring/" className="link" target="_blank"
             rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
  );
}

export default App;
