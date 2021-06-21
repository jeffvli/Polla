import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Randomstring from "randomstring";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PollCreator from "./poll/PollCreator";
import PollResponder from "./poll/PollResponder";
import MissingPage from "./missingpage/MissingPage";
import PollShare from "./poll/PollShare";
import Login from "./auth/Login";
import Register from "./auth/Register";
import PollResults from "./poll/PollResults";
import { useUser } from "../api/api";

function App() {
  const { user, isLoading, isError } = useUser(localStorage.getItem("token"));

  if (!sessionStorage.getItem("sessionId")) {
    sessionStorage.setItem("sessionId", Randomstring.generate(24));
  }

  return (
    <>
      <Router>
        {user && !isLoading && (
          <>
            <Navbar user={user} />
            <Switch>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/login">
                <Login user={user} />
              </Route>
              <Route path="/polls/:pollSlug/results">
                <PollResults user={user} />
              </Route>
              <Route path="/polls/:pollSlug">
                <PollResponder />
              </Route>
              <Route exact path="/">
                <PollCreator user={user} mb="5rem" />
              </Route>
              <Route path="*">
                <MissingPage />
              </Route>
            </Switch>
            <Footer />
          </>
        )}
      </Router>
    </>
  );
}

export default App;
