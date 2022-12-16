document.addEventListener('DOMContentLoaded', () => {
    loadTable(document.getElementById('users-table'),
        'delete-buttons', 'change-buttons')
})

document.getElementById('create-user-dialog-button').addEventListener('click', () => {
    document.getElementById('firstName-reg').value = ''
    document.getElementById('lastName-reg').value = ''
    document.getElementById('email-reg').value = ''
    document.getElementById('password-reg').value = ''
})

document.getElementById('add-user-button').addEventListener('click', () => {

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
            alert(`${data.message}`)
            bootstrap.Modal.getInstance(document.getElementById('create-modal')).hide()
            loadTable(document.getElementById('users-table'),
                'delete-buttons', 'change-buttons')
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

function createUsersTable(usersData) {
    let html = `
    <tr>
        <th>Id пользователя</th>
        <th>Имя пользователя</th>
        <th>Фамилия пользователя</th>
        <th>Email полльзователя</th>
        <th>Роль пользователя</th>
        <th colspan="3">Контроллеры</th>
    </tr>`
    for (let i = 0; i < usersData.length; i++) {
        let additionalHtml = `
        <tr>
            <td>${usersData[i].id}</td>
            <td>${usersData[i].firstName}</td>
            <td>${usersData[i].lastName}</td>
            <td>${usersData[i].email}</td>
            <td id="table-role-${i}">${usersData[i].role}</td>
            <td><button id="delete-${i}" class="btn btn-primary btn-sm">Удалить</button></td>
            <td>
                <select class="form-select form-select-sm" id="select-${i}">
                    <option value="ROLE_USER">Пользователь</option>
                    <option value="ROLE_MODERATOR">Модератор</option>
                    <option value="ROLE_ADMIN">Администратор</option>
                </select>
            </td>
            <td><button id="change-${i}" class="btn btn-primary btn-sm">Изменить роль</button></td>
        </tr>`
        html += additionalHtml
    }
    return html
}

function paintTable(usersData) {
    for (let i = 0; i < usersData.length; i++) {
        let role = document.getElementById(`table-role-${i}`)
        switch (usersData[i].role) {
            case 'ROLE_USER':
                role.textContent = 'Пользователь'
                role.style.color = '#080707'
                break
            case 'ROLE_MODERATOR':
                role.textContent = 'Модератор'
                role.style.color = '#3cc74a'
                break
            case 'ROLE_ADMIN':
                role.textContent = 'Администратор'
                role.style.color = '#e00d23'
                break
            default:
                break
        }
    }
}

function addEventsToButtons(buttonType, usersData) {
    switch (buttonType) {
        case 'delete-buttons':
            for (let i = 0; i < usersData.length; i++) {
                document.getElementById(`delete-${i}`).addEventListener('click', () => {
                    let delete_url = `http://localhost:8080/users/delete/${usersData[i].id}`
                    fetch(delete_url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }).then(async response => {
                        if (response.ok) {
                            let data = await response.json()
                            alert(`Пользователь с id=${data.message} был удален из базы данных`)
                            loadTable(document.getElementById('users-table'),
                                'delete-buttons', 'change-buttons')
                        }
                    })
                })
            }
            break
        case 'change-buttons':
            for (let i = 0; i < usersData.length; i++) {
                document.getElementById(`change-${i}`).addEventListener('click', () => {
                    let select = document.getElementById(`select-${i}`)
                    let change_url = `http://localhost:8080/users/raise/${usersData[i].id}/${select.value}`
                    fetch(change_url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }).then(async response => {
                        if (response.ok) {
                            let data = await response.json()
                            alert(`Пользователю с id=${usersData[i].id} была присовена роль новая роль`)
                            loadTable(document.getElementById('users-table'),
                                'delete-buttons', 'change-buttons')
                        }
                    })
                })
            }
            break
        default:
            break
    }
}

function loadTable(tableEl, ...buttonTypes) {
    const users_data_url = 'http://localhost:8080/users/all'
    fetch(users_data_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            tableEl.innerHTML = createUsersTable(data)
            paintTable(data)
            for (let i = 0; i < buttonTypes.length; i++) {
                addEventsToButtons(buttonTypes[i], data)
            }
        } else if (response.status == 403) {
            document.location.replace('../html/profile.html')
        }
    })
}