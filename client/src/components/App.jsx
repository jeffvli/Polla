import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import Poll from "./poll/Poll";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Poll></Poll>
        <Footer />
      </Router>
    </>
  );
}

export default App;
