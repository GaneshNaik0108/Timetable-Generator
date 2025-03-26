import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartScene from "./StartScene";
import NewScene2 from "./NewScene2";
import NewScene3 from "./NewScene3";
import CombinedJavaFXApplication from "./CombinedJavaFXApplication";
import TimeTableDisplay from "./TimeTable_Display"; // This import matches your file name with underscore

// Keep the Tailwind CSS CDN
const tailwind = document.createElement("script");
tailwind.src = "https://cdn.tailwindcss.com";
document.head.appendChild(tailwind);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScene />} />
        <Route path="/newscene2" element={<NewScene2 />} />
        <Route path="/newscene3" element={<NewScene3 />} />
        <Route path="/combinedJavaFXApplication" element={<CombinedJavaFXApplication />} />
        {/* CRITICAL FIX: This path must match what navigate() uses in CombinedJavaFXApplication */}
        <Route path="/TimeTableDisplay" element={<TimeTableDisplay />} />
        
        {/* Alternative paths in case you navigate differently in some places */}
        <Route path="/timetable" element={<TimeTableDisplay />} />
        <Route path="/TimeTable_Display" element={<TimeTableDisplay />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;