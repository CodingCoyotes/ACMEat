export async function registerNewUser(credentials) {
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