import { Route } from "react-router-dom";
import Settings from "../../pages/Settings";

const sharedRoutes = [
  <Route path="/settings" element={<Settings />} key="settings" />,
];

export default sharedRoutes;
