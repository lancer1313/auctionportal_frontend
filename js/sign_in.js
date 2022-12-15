document.getElementById('login-button').addEventListener('click', () => {

    document.getElementById('error-field').classList.add('d-none')

    const loginData = {
        "email": document.getElementById('email-login').value,
        "password": document.getElementById('password-login').value
    }

    const url = 'http://localhost:8080/auth/signin'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            sessionStorage.setItem('token', data.message)
            document.location.replace('../html/profile.html')
        } else if (response.status == 403) {
            let errorEl = document.getElementById('error-field')
            errorEl.textContent = 'Введены не верные учетные данные'
            errorEl.classList.remove('d-none')
        }
    })
})