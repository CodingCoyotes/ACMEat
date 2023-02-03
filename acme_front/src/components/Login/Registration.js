import React, { useState }from "react"
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../Context";
import {registerNewOrder, registerNewUser} from "../Database/DBacmeat";

export default function Registration() {
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [repassword, setRepassword] = useState();
  //   const [usertype, setUsertype] = useState(false);
  //const {token, setToken} = useAppContext()

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("handleSubmit");

    // bisogna aggiungere dei controlli visivi sugli input
    if(password === repassword){
        console.log("pass uguali");
        let info ={
          "name": name,
          "surname": surname,
          "email": email,
          "password": password,

        };
      const response = await registerNewUser(info);
      if (response.status === 200) {
        let values = await response.json()
      }
        navigate("/login");
    }
    console.log("pass diverse");
  }

    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Registrati</h3>
            <div className="form-group mt-3">
              <label>Nome</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Inserisci il tuo nome"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Cognome</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Inserisci il tuo cognome"
                onChange={e => setSurname(e.target.value)}
              />
            </div>
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
            <div className="form-group mt-3">
              <label>Ripeti la password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Inserisci password"
                onChange={e => setRepassword(e.target.value)}
              />
            </div>
            {/* <div className="form-group mt-3">
                <label>Registrati come</label>
                <select className="form-select" aria-label="Default select example" onChange={e => setUsertype(e.target.value)}>
                    {roles.map((e, key) => {
                        return <option key={key} value={e.value}>{e.name}</option>;
                    })}
                </select>
            </div> */}
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Invia
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
              Oppure
            </p>
            <div className="d-grid gap-2 mt-3">
              <button type="button" className="btn btn-secondary" onClick={event => {navigate("/login")}}>
                Esegui il login
              </button>
            </div>
          </div>
        </form>
      </div>
    )
}