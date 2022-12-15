document.getElementById('register-button').addEventListener('click', () => {

    document.querySelectorAll('.pole').forEach(element => element.classList.remove('is-invalid'))
    document.querySelectorAll('.errors').forEach(element => element.classList.add('d-none'))

    const registrationData = {
        "firstName": document.getElementById('firstName-reg').value,
        "lastName": document.getElementById('lastName-reg').value,
        "email": document.getElementById('email-reg').value,
        "password": document.getElementById('password-reg').value
    }

    const url = 'http://localhost:8080/auth/signup'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            console.log(data.message)
            document.location.replace('sign_in.html')
        } else if (response.status == 400) {
            let data = await response.json()
            console.log(data)
            let fields = Object.keys(data)
            let errors = Object.values(data)
            for (let i = 0; i < fields.length; i++) {
                let errorEl = document.getElementById(`error-${fields[i]}`)
                errorEl.textContent = errors[i]
                errorEl.classList.remove('d-none')
                document.getElementById(`${fields[i]}-reg`).classList.add('is-invalid')
            }
        } else if (response.status == 406) {
            let data = await response.json()
            let errorEl = document.getElementById(`error-${Object.keys(data)[0]}`)
            errorEl.textContent = Object.values(data)[0];
            errorEl.classList.remove('d-none')
            document.getElementById(`${Object.keys(data)[0]}`).classList.add('is-invalid')
        }
    })
})