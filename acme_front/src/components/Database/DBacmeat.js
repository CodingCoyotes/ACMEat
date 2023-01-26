
const address = 'https://acmeat.isos.fermitech.info';

// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI UTENTE
// ---------------------------------------------------------------------------------------------
//registra un nuovo utente date le credenziali
export async function registerNewUser(credentials) {
  //localStorage.setItem('token', credentials)
  return fetch(address + "/token", {
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
  return fetch(address + "/token", {
    method: "POST",
    //credentials: "include",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formB
  });
}

//dato il token restituisce le informazioni utente
export async function getUserInfo(token, domain){
  return fetch(address + "/api/user/v1/me", {
    method: "GET",
    //credentials: "include",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token,

    },
  });
}

// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI RISTORANTE
// ---------------------------------------------------------------------------------------------

//registra un nuovo ristorante date le informazioni
export async function registerNewRestaurant(token, info) {
  return fetch(address + "/api/restaurants/v1/", {
    method: 'POST',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token,
    },
    body: JSON.stringify(info)
  })
      .then(data => data.json())
}

//registra un nuovo ristorante date le informazioni
export async function getRestaurants(domain) {
  return fetch(address + "/api/restaurants/v1/", {
    method: 'GET',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',

    }
  })
}

// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI CITY
// ---------------------------------------------------------------------------------------------
//Registra una nuova città
export async function registerNewCity(token, info) {
  return fetch(address + "/api/cities/v1/", {
    method: 'POST',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token,
    },
    body: JSON.stringify(info)
  })
      .then(data => data.json())
}

//Ottiene le città
export async function getCities(domain) {
  return fetch(address + "/api/cities/v1/", {
    method: 'GET',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',

    }
  });
}

//Ottiene una città dal suo id
export async function getCity(id, domain) {
  return fetch(address + "/api/cities/v1/" + id, {
    method: "GET",
    //credentials: "include",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
}


