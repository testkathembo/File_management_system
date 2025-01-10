import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DirectoryPage from "./components/DirectoryPage";
import HighLevelPage from "./components/HighLevelPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={DirectoryPage} />
        <Route path="/high-level" component={HighLevelPage} />
      </Switch>
    </Router>
  );
};

export default App;
