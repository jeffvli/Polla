import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PollForm from "./poll/PollForm";
import Poll from "./poll/Poll";
import MissingPage from "./missingpage/MissingPage";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Footer />
        <Switch>
          <Route exact path="/polls/:pollId">
            <Poll></Poll>
          </Route>
          <Route exact path="/">
            <PollForm></PollForm>
          </Route>
          <Route path="*">
            <MissingPage></MissingPage>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
