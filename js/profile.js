let localStorageManager
document.addEventListener('DOMContentLoaded', e => {
    localStorageManager = new LocalStorageManager()
    const avatar_url = 'http://localhost:8080/avatar/' + localStorageManager.getId()
    const data_url = 'http://localhost:8080/profile/' + localStorageManager.getId()

    reloadAvatar(avatar_url)

    fetch(data_url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            document.getElementById('first-name').textContent = data.firstName
            document.getElementById('last-name').textContent = data.lastName
            document.getElementById('session-count').textContent = data.loginsCount
            document.getElementById('date-and-time').textContent = data.dateAndTime
        }
    })

    const userAuthorities = localStorageManager.getAuthorities()
    let role = document.getElementById('role')
    let additionalContent
    switch (userAuthorities) {
        case ('["ROLE_USER"]'):
            role.textContent = '(Пользователь)'
            role.style.color = '#080707'
            additionalContent = `
            <div class="block flex-column">
                <button class="normal-button" id="post-button">Оставить заявку</button>
            </div>`
            document.getElementById('roles-container').innerHTML += additionalContent
            break
        case ('["ROLE_MODERATOR"]'):
            role.textContent = '(Модератор)'
            role.style.color = '#3cc74a'
            additionalContent = `
            <div class="block flex-column">
                <button class="normal-button" id="post-button">Оставить заявку</button>
                <button class="normal-button" id="news-button">Управление новостями</button>
            </div>`
            document.getElementById('roles-container').innerHTML += additionalContent
            break
        case ('["ROLE_ADMIN"]'):
            role.textContent = '(Администратор)'
            role.style.color = '#e00d23'
            additionalContent = `
            <div class="block flex-column">
                <button class="normal-button" id="post-button">Оставить заявку</button>
                <button class="normal-button" id="news-button">Управление новостями</button>
                <button class="normal-button" id="users-button">Управление пользователями</button>
            </div>`
            document.getElementById('roles-container').innerHTML += additionalContent
            break
        default:
            break
    }
})

document.getElementById('logout').addEventListener('click', e => {
    localStorageManager.signOut()
    document.location.replace('../index.html')
})

document.getElementById('send-photo').addEventListener('click', e => {
    const upload_avatar_url = 'http://localhost:8080/avatar/send'
    let image = document.getElementById('photo').files[0]
    let formData = new FormData()
    formData.append('id', localStorageManager.getId())
    formData.append('image', image)
    fetch(upload_avatar_url, {
        method: 'PUT',
        body: formData
    }).then(async response => {
        if (response.ok) {
            const avatar_url = 'http://localhost:8080/avatar/' + localStorageManager.getId()
            reloadAvatar(avatar_url)
        } else if (response.status == 406) {
            let data = await response.json()
            document.getElementById('avatar-err').textContent = data.message
        } else if (response.status == 417) {
            let data = await response.json()
            document.getElementById('avatar-err').textContent = data.message
        }
    })
})

function reloadAvatar(url) {
    fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
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