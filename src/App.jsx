import { Fragment } from "react";
import { privateRoutes, publicRoutes } from "./routes/route.js";
import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout/index.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import LoggedInRoute from "./routes/LoggedInRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        {publicRoutes.map(
          (item, index) => {
            var Page = item.page;
            let Layout = Fragment;
            if (item.layout) {
              Layout = item.layout;
            }
            else if (item.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route key={index} element={<LoggedInRoute path={item.path} />}>
                <Route path={item.path} element={<Layout><Page /></Layout>} />
              </Route>
            );
          }
        )}
        {privateRoutes.map(
          (item, index) => {
            var Page = item.page;
            var Layout = DefaultLayout;
            if (item.layout) {
              Layout = item.layout;
            }
            else if (item.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route key={index} element={<ProtectedRoute path={item.path} />}>
                <Route path={item.path} element={<Layout><Page /></Layout>} />
              </Route>
            );
          }
        )}
      </Routes>
    </>
  )
}

export default App
