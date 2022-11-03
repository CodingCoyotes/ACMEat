import React, { useState }from "react"
import PropTypes from 'prop-types';

// async function loginUser(credentials) {
//   localStorage.setItem('token', credentials)
//   return fetch('http://localhost:8080/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(credentials)
//   })
//     .then(data => data.json())
// }

 
export default function Login({ setToken }) {
  console.log("Sono in Login");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [choose, setChoose] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("handleSubmit");
    const token = {
      token: email
    };
    // await loginUser({
    //   email,
    //   password
    // });
    setToken(token);
  }

  const handleChoose = async e => {
    e.preventDefault();
    //console.log(e.target.id);
    if(e.target.id == "ristorante")
      console.log("ristorante");
    else 
      console.log("cliente");
    setChoose(true);
  }

  if(!choose)
    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Tipo di accesso</h3>
            <div className="d-grid gap-2 mt-3">
              <button id="ristorante" onClick={handleChoose} className="btn btn-primary">
                Per ristoranti
              </button>
              <button id="ciao" onClick={handleChoose} className="btn btn-primary">
                Per clienti
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  else
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

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}