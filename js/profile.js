document.addEventListener('DOMContentLoaded', () => {
    const avatar_url = 'http://localhost:8080/avatar/get'
    const data_url = 'http://localhost:8080/auth/profile'

    reloadAvatar(avatar_url)

    let userAuthorities
    fetch(data_url, {
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
            document.getElementById('date-and-time').textContent = data.dateAndTime
            userAuthorities = data.role
            let role = document.getElementById('role')
            let additionalContent
            switch (userAuthorities) {
                case ('[ROLE_USER]'):
                    role.textContent = '(Пользователь)'
                    role.style.color = '#080707'
                    additionalContent = `
                    <div class="block flex-column">
                        <button class="normal-button" id="user-button">Оставить заявку</button>
                    </div>`
                    document.getElementById('roles-container').innerHTML += additionalContent
                    makeRelocateButton('user-button', '../html/user-page.html')
                    break
                case ('[ROLE_MODERATOR]'):
                    role.textContent = '(Модератор)'
                    role.style.color = '#3cc74a'
                    additionalContent = `
                    <div class="block flex-column">
                        <button class="normal-button" id="user-button">Оставить заявку</button>
                        <button class="normal-button" id="mod-button">Управление новостями</button>
                    </div>`
                    document.getElementById('roles-container').innerHTML += additionalContent
                    makeRelocateButton('user-button', '../html/user-page.html')
                    makeRelocateButton('mod-button', '../html/mod-page.html')
                    break
                case ('[ROLE_ADMIN]'):
                    role.textContent = '(Администратор)'
                    role.style.color = '#e00d23'
                    additionalContent = `
                    <div class="block flex-column">
                        <button class="normal-button" id="user-button">Оставить заявку</button>
                        <button class="normal-button" id="mod-button">Управление новостями</button>
                        <button class="normal-button" id="admin-button">Управление пользователями</button>
                    </div>`
                    document.getElementById('roles-container').innerHTML += additionalContent
                    makeRelocateButton('user-button', '../html/user-page.html')
                    makeRelocateButton('mod-button', '../html/mod-page.html')
                    makeRelocateButton('admin-button', '../html/admin-page.html')
                    break
                default:
                    break
            }
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
            document.location.replace('../index.html')
        }
    })
})

document.getElementById('send-photo').addEventListener('click', e => {
    document.getElementById('avatar-err').classList.add('hide')
    const upload_avatar_url = 'http://localhost:8080/avatar/send'
    let image = document.getElementById('photo').files[0]
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
            let element = document.getElementById('avatar-err')
            element.classList.remove('hide')
            element.textContent = data.message
        } else if (response.status == 417) {
            let data = await response.json()
            let element = document.getElementById('avatar-err')
            element.classList.remove('hide')
            element.textContent = data.message
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