// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI UTENTE
// ---------------------------------------------------------------------------------------------

//registra un nuovo utente date le credenziali
export async function registerNewUser(credentials) {
  //localStorage.setItem('token', credentials)
  return fetch('http://localhost:8000/api/user/v1/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

//login
export async function loginUser(formB){
  return fetch("http://127.0.0.1:8000" + "/token", {
    method: "POST",
    credentials: "include",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Access-Control-Allow-Origin': process.env.DOMAIN
    },
    body: formB
  });
}

//dato il token restituisce le informazioni utente
export async function getUserInfo(token, domain){
  return fetch("http://localhost:8000" + "/api/user/v1/me", {
    method: "GET",
    credentials: "include",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
        'Access-Control-Allow-Origin': process.env.DOMAIN
    },
  });
}

// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI RISTORANTE
// ---------------------------------------------------------------------------------------------

//registra un nuovo ristorante date le informazioni
export async function registerNewRestaurant(info) {
  return fetch('http://localhost:8000/api/restaurants/v1/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
  })
    .then(data => data.json())
}