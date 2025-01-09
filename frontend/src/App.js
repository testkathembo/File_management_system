import React from "react";
import "./App.css";
import DirectoryPage from "./components/DirectoryPage";

function App() {
    return (
        <div className="container mt-4" >
            <h1 className="text-center">File Management System</h1>
            <DirectoryPage />
        </div>
    );
}

export default App;
