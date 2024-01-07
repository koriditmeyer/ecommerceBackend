const formAddProduct = document.querySelector('#addProduct')

formAddProduct?.addEventListener('submit', async event => {
  event.preventDefault()
  
  const formData = new FormData(formAddProduct);
  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData
  })

  if (response.status === 201) {
    window.location.href = '/'
  } else {
    const error = await response.json()
    alert(error.message)
  }
})