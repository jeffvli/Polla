import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Randomstring from "randomstring";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PollCreator from "./poll/PollCreator";
import PollResponder from "./poll/PollResponder";
import MissingPage from "./missingpage/MissingPage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import PollResults from "./poll/PollResults";
import { useUser } from "../api/api";
import Profile from "./profile/Profile";

function App() {
  const { user } = useUser(localStorage.getItem("token"));

  if (!sessionStorage.getItem("sessionId")) {
    sessionStorage.setItem("sessionId", Randomstring.generate(24));
  }

  return (
    <>
      <Router>
        <>
          <Navbar user={user} />
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/:pollSlug/results">
              <PollResults user={user} />
            </Route>
            <Route path="/:pollSlug">
              <PollResponder user={user} />
            </Route>
            <Route exact path="/">
              <PollCreator mb="5rem" />
            </Route>
            <Route path="*">
              <MissingPage />
            </Route>
          </Switch>
        </>
      </Router>
    </>
  );
}

export default App;
