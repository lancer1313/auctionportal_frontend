document.addEventListener('DOMContentLoaded', () => {
    loadTable(document.getElementById('users-table'),
        'delete-buttons', 'change-buttons')
})

function createUsersTable(usersData) {
    let html = `
    <tr>
        <td>Id пользователя</td>
        <td>Имя пользователя</td>
        <td>Фамилия пользователя</td>
        <td>Email полльзователя</td>
        <td>Роль пользователя</td>
    </tr>`
    for (let i = 0; i < usersData.length; i++) {
        let additionalHtml = `
        <tr>
            <td>${usersData[i].id}</td>
            <td>${usersData[i].firstName}</td>
            <td>${usersData[i].lastName}</td>
            <td>${usersData[i].email}</td>
            <td id="table-role-${i}">${usersData[i].role}</td>
            <td><button id="delete-${i}" class="delete-buttons">Удалить</button></td>
            <td>
                <select id="select-${i}">
                    <option value="ROLE_USER">Пользователь</option>
                    <option value="ROLE_MODERATOR">Модератор</option>
                    <option value="ROLE_ADMIN">Администратор</option>
                </select>
            </td>
            <td><button id="change-${i}" class="change-buttons">Изменить роль</button></td>
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