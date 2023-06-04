import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routeUrl from "./routes/routeUrl";
import Home from "./pages/home";
import SignPage from "./pages/sign";
import Login from "./pages/login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={routeUrl.HOME_PAGE} element ={<Home/>}/>
          <Route path = {routeUrl.SIGN} element = {<SignPage/>}/>
          <Route path = {routeUrl.LOGIN} element = {<Login/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
