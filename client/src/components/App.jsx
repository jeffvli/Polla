import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PollCreator from "./poll/PollCreator";
import PollResponder from "./poll/PollResponder";
import MissingPage from "./missingpage/MissingPage";
import PollShare from "./poll/PollShare";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { useUser } from "../api/api";

function App() {
  const { user, isLoading, isError } = useUser();

  return (
    <>
      <Router>
        {!isLoading && (
          <>
            <Navbar user={user} />
            <Switch>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/login">
                <Login user={user} />
              </Route>
              <Route exact path="/polls/:pollSlug">
                <PollResponder />
                <PollShare mt="2rem" mb="5rem" />
              </Route>
              <Route exact path="/">
                <PollCreator user={user} />
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
