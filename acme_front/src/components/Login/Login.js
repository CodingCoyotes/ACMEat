import React, { useState }from "react"
//import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import { loginUser as LUser}  from "../Database/DBacmeat" ;

 
export default function Login() {
  console.log("Sono in Login");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  //const [choose, setChoose] = useState(false);
  const {token, setToken} = useAppContext()

  const navigate = useNavigate()

  async function loginUser() {
    let body = {
      "grant_type":"password",
      "username":email,
      "password":password

    }
    var formB = []
    for (var property in body) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(body[property]);
      formB.push(encodedKey + "=" + encodedValue);
    }
    formB = formB.join("&");

    const response = await LUser(formB);
    if (response.status === 200) {
      let values = await response.json()
      console.debug(values)
      setToken(values.access_token)
      navigate("/dashboard")
    }
    else{
      alert("Credenziali non corrette.")
    }
  }


  const handleSubmit = async e => {
    e.preventDefault();
    console.log("handleSubmit");
    loginUser()
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