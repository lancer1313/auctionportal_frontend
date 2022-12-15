document.addEventListener('DOMContentLoaded', () => {

    const avatar_url = 'http://localhost:8080/avatar/get'
    const profile_data_url = 'http://localhost:8080/auth/profile'

    reloadAvatar(avatar_url)
    let timer = setInterval(getTime, 1000)

    let userAuthorities
    fetch(profile_data_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            document.getElementById('first-name').textContent = data.firstName
            document.getElementById('last-name').textContent = data.lastName
            document.getElementById('session-count').textContent = data.loginsCount
            userAuthorities = data.role
            let additionalContent
            let role = document.getElementById('role')
            switch (userAuthorities) {
                case ('[ROLE_USER]'):
                    role.textContent = '(Пользователь)'
                    role.style.color = '#080707'
                    additionalContent = `
                    <div class="btn-group-vertical">
                        <a class="btn btn-primary mb-2" href="lot_page.html">Ваши лоты</a>
                    </div>`
                    document.getElementById('role-content').innerHTML += additionalContent
                    break
                case ('[ROLE_MODERATOR]'):
                    role.textContent = '(Модератор)'
                    role.style.color = '#3cc74a'
                    additionalContent = `
                    <div class="btn-group-vertical">
                        <a class="btn btn-primary mb-2" href="lot_page.html">Ваши лоты</a>
                        <a class="btn btn-primary mb-2" href="moderator_page.html">Панель модератора</a>
                    </div>`
                    document.getElementById('role-content').innerHTML += additionalContent
                    break
                case ('[ROLE_ADMIN]'):
                    role.textContent = '(Администратор)'
                    role.style.color = '#e00d23'
                    additionalContent = `
                    <div class="btn-group-vertical">
                        <a class="btn btn-primary mb-2" href="lot_page.html">Ваши лоты</a>
                        <a class="btn btn-primary mb-2" href="moderator_page.html">Панель модератора</a>
                        <a class="btn btn-primary mb-2" href="admin_page.html">Панель администратора</a>
                    </div>`
                    document.getElementById('role-content').innerHTML += additionalContent
                    break
            }
        } else if (response.status == 403) {
            document.location.replace('../html/sign_in.html')
        }
    })
})

document.getElementById('send-photo').addEventListener('click', () => {
    let image = document.getElementById('avatar-file').files[0]
    if (image == null) {
        return
    }
    document.getElementById('error-file').classList.add('d-none')
    const upload_avatar_url = 'http://localhost:8080/avatar/send'
    let formData = new FormData()
    formData.append('image', image)
    fetch(upload_avatar_url, {
        method: 'PUT',
        body: formData,
        headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
    }).then(async response => {
        if (response.ok) {
            const avatar_url = 'http://localhost:8080/avatar/get'
            reloadAvatar(avatar_url)
        } else if (response.status == 406) {
            let data = await response.json()
            let element = document.getElementById('error-file')
            element.classList.remove('d-none')
            element.textContent = data.error
        } else if (response.status == 417) {
            let data = await response.json()
            let element = document.getElementById('error-file')
            element.classList.remove('d-none')
            element.textContent = data.error
        }
    })
})

document.getElementById('logout').addEventListener('click', e => {
    const logout_url = 'http://localhost:8080/auth/profile'
    fetch(logout_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(response => {
        if (response.ok) {
            sessionStorage.setItem('token', '')
            document.location.replace('../index.html')
        }
    })
})

function reloadAvatar(url) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            document.getElementById('avatar').setAttribute('src', data.message)
        } else {
            let data = await response.json()
            document.getElementById('avatar-err').textContent = data.message;
        }
    })
}

function getTime() {
    const time_url = 'http://localhost:8080/auth/time'
    fetch(time_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            document.getElementById('date-and-time').textContent = data.message
        }
    })
}