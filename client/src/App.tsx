import { Routes, Route } from "react-router";

import MainOutlet from "./components/outlets/MainOutlet";
import Home from "./components/pages/Home";
import Questions from "./components/pages/Questions";
import SpecificQuestionPage from "./components/pages/SpecificQuestionPage";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import User from "./components/pages/User";
import MyActivity from "./components/pages/MyActivity";
import NewQuestion from "./components/pages/NewQuestion";
import EditQuestion from "./components/pages/EditQuestion";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="" element={<MainOutlet />}>
          <Route index element={<Home />} />
          <Route path="questions" element={<Questions />} />
          <Route path="questions/:id" element={<SpecificQuestionPage />} />
          <Route path="edit/:id" element={<EditQuestion />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="user" element={<User />} />
          <Route path="myActivity" element={<MyActivity />} />
          <Route path="newQuestion" element={<NewQuestion />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
