document.addEventListener('DOMContentLoaded', (event) => {
const formLogin = document.querySelector('#login-form')

formLogin?.addEventListener('submit', async event => {
  event.preventDefault()

  const response = await fetch('/api/sessions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // @ts-ignore
    body: new URLSearchParams(new FormData(formLogin))
  })
  console.log(response.status)
  if (response.status === 201) {
    console.log('Redirecting to profile');
    window.location.href = '/profile'
  } else {
    console.log('Handling error');
    const error = await response.json()
    alert(error.message)
  }
})
})