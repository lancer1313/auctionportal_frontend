document.getElementById('login').addEventListener('click', e => {
    document.querySelectorAll('.errors').forEach(element => element.classList.add('hide'))
    document.querySelectorAll('.pole').forEach(element => element.classList.remove('error-class'))

    let requestBody = {
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value
    }

    const url = 'http://localhost:8080/auth/signin'

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            sessionStorage.setItem('token', data.message)
            document.location.replace('../html/profile.html')
        } else if (response.status == 403) {
            let errorEl = document.getElementById('error-log')
            errorEl.textContent = 'Введены неверные учетные данные'
            errorEl.classList.remove('hide')
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
        }
    })

    // let request = new XMLHttpRequest()
    // request.open('POST', url);
    // request.responseType = 'json'
    // request.withCredentials = true
    // request.setRequestHeader('Access-Control-Allow-Headers', '*')
    // request.setRequestHeader('Content-Type', 'application/json')
    // request.onreadystatechange = function() {
    //     if (request.status == 200) {
    //         let response = request.response
    //         console.log(response)
    //     } else if (request.status == 403) {
    //         let errorEl = document.getElementById('error-log')
    //         errorEl.textContent = 'Введены неверные учетные данные'
    //         errorEl.classList.remove('hide')
    //     } else if (request.status == 400) {
    //         let data = request.response
    //         let fields = Object.keys(data)
    //         let errors = Object.values(data)
    //         for (let i = 0; i < fields.length; i++) {
    //             let errorEl = document.getElementById(`${fields[i]}-err`)
    //             errorEl.textContent = errors[i]
    //             errorEl.classList.remove('hide')
    //             document.getElementById(`${fields[i]}`).classList.add('error-class')
    //         }
    //     }
    // }
    // request.send(JSON.stringify(requestBody))
})