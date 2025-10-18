import { Routes, Route } from "react-router-dom";
import DriveLayout from "./DriveLayout";
import DriveHome from "./sub-routes/DriveHome";
import DriveRecent from "./sub-routes/DriveRecent";
import DrivePrivate from "./sub-routes/DrivePrivate";
import DriveShared from "./sub-routes/DriveShared";
import DriveTagged from "./sub-routes/DriveTagged";
import DriveTrash from "./sub-routes/DriveTrash";

// This is your main Drive entry point for <Route path="/drive/*" element={<Drive />} />
export default function Drive() {
  return (
    <Routes>
      <Route path="/" element={<DriveLayout />}>
        <Route path="home" element={<DriveHome />} />
        <Route path="recent" element={<DriveRecent />} />
        <Route path="private" element={<DrivePrivate />} />
        <Route path="shared" element={<DriveShared />} />
        <Route path="tagged" element={<DriveTagged />} />
        <Route path="trash" element={<DriveTrash />} />
      </Route>
    </Routes>
  );
}