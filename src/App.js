import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import {
  faArrowsLeftRight,
  faBars,
  faBookmark,
  faChevronDown,
  faChevronUp,
  faPencil,
  faPlus,
  faServer,
  faTrash,
  faThumbTack,
  faUser,
  faVolumeHigh,
  faVolumeXmark,
  faXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import Translation from "./layout/content/Translation";
import Advice from "./layout/content/Advice";
import Chat from "./layout/content/Chat";
import Opinion from "./layout/content/Opinion";
import AudioRecorder from "./components/AudioRecorder";

library.add(
  faArrowsLeftRight,
  faSpinner,
  faBars,
  faBookmark,
  faChevronDown,
  faChevronUp,
  faPencil,
  faPlus,
  faServer,
  faTrash,
  faThumbTack,
  faUser,
  faVolumeHigh,
  faVolumeXmark,
  faXmark
);

function App() {
  const basename = `${process.env.PUBLIC_URL}`;

  return (
    <div className="App">
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Navigate to="/translation" />} />
          {/* <Route path="/translation" element={<Translation />} /> */}
          <Route path="/translation" element={<AudioRecorder />} />

          <Route path="/advice" element={<Advice />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/opinion" element={<Opinion/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
