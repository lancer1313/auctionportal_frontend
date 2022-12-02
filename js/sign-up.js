document.getElementById('register').addEventListener('click', e => {
    document.querySelectorAll('.pole').forEach(element => element.classList.remove('error-class'))
    document.querySelectorAll('.errors').forEach(element => element.classList.add('hide'))

    let requestBody = {
        "firstName": document.getElementById('firstName').value,
        "lastName": document.getElementById('lastName').value,
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value
    }

    const url = 'http://localhost:8080/auth/signup';

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
    }).then(async response => {
        if (response.ok) {
            document.location.replace('../html/sign-in.html')
        } else if (response.status == 400) {
            let data = await response.json()
            let fields = Object.keys(data)
            let errors = Object.values(data)
            for (let i = 0; i < fields.length; i++) {
                let errorEl = document.getElementById(`${fields[i]}-err`)
                errorEl.textContent = errors[i]
                errorEl.classList.remove('hide')
                document.getElementById(`${fields[i]}`).classList.add('error-class')
            }
        } else if (response.status == 406) {
            let data = await response.json()
            let errorEl = document.getElementById(`${Object.keys(data)[0]}-err`)
            errorEl.textContent = Object.values(data)[0];
            errorEl.classList.remove('hide')
            document.getElementById(`${Object.keys(data)[0]}`).classList.add('error-class')
        }
    })
})