import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartScene from "./StartScene";
import NewScene2 from "./NewScene2";
import NewScene3 from "./NewScene3";
import CombinedJavaFXApplication from "./CombinedJavaFXApplication";
// Choose ONE of these imports based on your actual file name:
import TimeTableDisplay from "./TimeTableDisplay"; 
// OR (if your file is named with underscore):
// import TimeTableDisplay from "./TimeTable_Display";

// Single, consolidated App component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScene />} />
        <Route path="/newscene2" element={<NewScene2 />} />
        <Route path="/newscene3" element={<NewScene3 />} />
        <Route path="/timetable-generate" element={<CombinedJavaFXApplication />} />
        {/* THIS PATH MUST EXACTLY MATCH what you use in navigate() */}
        <Route path="/TimeTableDisplay" element={<TimeTableDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;