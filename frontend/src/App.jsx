import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import UpdateProblem from "./pages/UpdateProblem";
import UpdateProfile from "./pages/UpdateProfile";
import SubmissionDetail from "./pages/SubmissionDetail";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state)=>state.auth);
   useSelector((state)=> console.log(state.auth))
  
  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);



  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/problem/update/:id" element={isAuthenticated ? <UpdateProblem /> : <Navigate to="/login" />}></Route>
      <Route path="/profile/update" element={isAuthenticated ? <UpdateProfile /> : <Navigate to="/login" />}></Route>
      <Route path="/submission/:id" element={isAuthenticated ? <SubmissionDetail /> : <Navigate to="/login" />}></Route>
    </Routes>
  </>
  )
}

export default App;