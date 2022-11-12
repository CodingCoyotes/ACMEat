import React, { useState }from "react"
import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";

async function loginUser(credentials) {
  localStorage.setItem('token', credentials)
  return fetch('http://localhost:8000/api/user/v1/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

 
export default function Login() {
  console.log("Sono in Login");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [choose, setChoose] = useState(false);
  const {token, setToken} = useAppContext()

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("handleSubmit");

    // await loginUser({
    //   email,
    //   password
    // });
    
    loginUser({
      "name": "NameTest",
      "surname": "SurnameTest",
      "email": "mailtest@who.us",
      "password": "pass"
    });
    setToken("token");
    navigate("/dashboard");
  }

  const handleChoose = async e => {
    e.preventDefault();
    //console.log(e.target.id);
    if(e.target.id === "ristorante")
      console.log("ristorante");
    else 
      console.log("cliente");
    setChoose(true);
  }

    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Accedi</h3>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Inserisci email"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Inserisci password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Invia
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
              Hai dimenticato la <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
    )
}