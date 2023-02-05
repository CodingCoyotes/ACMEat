
const address = 'http://127.0.0.1:8004';
//const address = 'https://acmeat.isos.fermitech.info';
// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI UTENTE
// ---------------------------------------------------------------------------------------------
//registra un nuovo utente date le credenziali
export async function registerNewUser(info) {
  return fetch(address + "/api/user/v1/", {
    method: 'POST',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      //'Authorization': "Bearer " + token,
    },
    body: JSON.stringify(info)
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

//Modifica ristorante
export async function modifyRestaurant(token, info, id) {
  return fetch(address + "/api/restaurants/v1/" + id, {
    method: 'PUT',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token
    },
    body: JSON.stringify(info)
  })
      .then(data => data.json())
}

//prendi tutti i ristoranti
export async function getRestaurants(domain) {
  return fetch(address + "/api/restaurants/v1/", {
    method: 'GET',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',

    }
  })
}

//Ottiene un ristorante dal suo id
export async function getRestaurant(id, domain) {
  return fetch(address + "/api/restaurants/v1/" + id, {
    method: "GET",
    //credentials: "include",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
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


// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI MENU
// ---------------------------------------------------------------------------------------------
//Registra un nuovo menu
export async function registerNewMenu(restaurant_id, info, token) {
  return fetch(address + "/api/menus/v1/" + restaurant_id, {
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

//Ottiene un menu dal suo id
export async function getMenu(id, domain) {
  return fetch(address + "/api/menus/v1/" + id, {
    method: "GET",
    //credentials: "include",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',

    }
  });
}

//Modifica un menu
export async function modifyMenu(token, info, id) {
  return fetch(address + "/api/menus/v1/" + id, {
    method: 'PUT',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token
    },
    body: JSON.stringify(info)
  })
      .then(data => data.json())
}

// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI ORDER
// ---------------------------------------------------------------------------------------------
//Registra un nuovo ordine
export async function registerNewOrder(order_id, info, token) {
  return fetch(address + "/api/orders/v1/" + order_id, {
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

//Ottiene un ordine dal suo id
export async function getOrder(id, token, domain) {
  return fetch(address + "/api/orders/v1/details/" + id, {
    method: "GET",
    //credentials: "include",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token,
    }
  });
}

//Modifica un menu
export async function modifyOrder(token, info, id) {
  return fetch(address + "/api/orders/v1/" + id, {
    method: 'PUT',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token
    },
    body: JSON.stringify(info)
  })
      .then(data => data.json())
}

// ---------------------------------------------------------------------------------------------
//                                      FUNZIONI PAYMENT
// ---------------------------------------------------------------------------------------------
//Registra un nuovo ordine
export async function payment(order_id, info, token) {
  console.debug(info)
  return fetch(address + "/api/orders/v1/" + order_id +"/payment", {
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
