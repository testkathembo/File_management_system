import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DirectoryPage from "./components/DirectoryPage";
import HighLevelPage from "./components/HighLevelPage";
import DirectoryDetailsPage from './components/DirectoryDetailsPage'; 


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={DirectoryPage} />
        <Route path="/high-level" component={HighLevelPage} />
        <Route path="/directory/:id" element={<DirectoryDetailsPage />} /> 
      </Switch>
    </Router>
  );
};

export default App;


