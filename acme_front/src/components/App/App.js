import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Login from "../Login/Login"
import Dashboard from '../Dashboard/Dashboard';
import { useToken } from "../Login/Token";
//import { BrowserRouter, Routes, Route } from "react-router-dom"

// function setToken(userToken) {
//   sessionStorage.setItem('token', JSON.stringify(userToken));
// }

// function getToken() {
//   const tokenString = sessionStorage.getItem('token');
//   const userToken = JSON.parse(tokenString);
//   return userToken?.token
// }

export function App() {
  console.log("Sono in app");
  const { token, setToken } = useToken();

  //Se non ha un token vai al login e imposta un token
  if(!token) {
    console.log("Non ho token");
    return <Login setToken={setToken} />
  }
  console.log("Ho un token");
  return (
    <Dashboard/>
    
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //   </Routes>
    //   <Routes>
    //     <Route path="/dashboard" element={<Dashboard />} />
    //   </Routes>
    //   <Routes>
    //     <Route path="/preferences" element={<Preferences />} />
    //   </Routes>
    // </BrowserRouter>
  )
}

export default App