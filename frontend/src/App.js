import React from 'react';
import DirectoryPage from './components/DirectoryPage'; // Import the main directory page component
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Management System</h1>
      </header>
      <main>
        {/* Main directory management page */}
        <DirectoryPage />
      </main>
    </div>
  );
}

export default App;
