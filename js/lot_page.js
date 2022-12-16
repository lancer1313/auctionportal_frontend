document.addEventListener('DOMContentLoaded', () => {
    loadTable(document.getElementById('lots-table'), 'delete-buttons', 'redact-buttons')
})

document.getElementById('lotDescription-create').addEventListener('input', () => {
    document.getElementById('label-lotDescription-create').textContent =
        `Описание лота (до 500 символов) (сейчас ${document.getElementById('lotDescription-create').value.length})`
})

document.getElementById('lotDescription-redact').addEventListener('input', () => {
    document.getElementById('label-lotDescription-redact').textContent =
        `Описание лота (до 500 символов) (сейчас ${document.getElementById('lotDescription-redact').value.length})`
})

document.getElementById('create-lot-dialog-button').addEventListener('click', () => {
    document.querySelectorAll('.pole').forEach(element => element.classList.remove('is-invalid'))
    document.querySelectorAll('.errors').forEach(element => element.classList.add('d-none'))

    document.getElementById('lotTitle-create').value = ''
    document.getElementById('lotDescription-create').value = ''
    document.getElementById('startingPrice-create').value = ''
    document.getElementById('minimalStep-create').value = ''
    document.getElementById('file-create').value = ''
})

document.getElementById('create-lot-button').addEventListener('click', () => {

    document.querySelectorAll('.pole').forEach(element => element.classList.remove('is-invalid'))
    document.querySelectorAll('.errors').forEach(element => element.classList.add('d-none'))

    if (document.getElementById('lotDescription-create').value.length > 500) {
        let errorEl = document.getElementById(`error-lotDescription-create`)
        errorEl.textContent = 'Превышен максимум символов'
        errorEl.classList.remove('d-none')
        document.getElementById('lotDescription-create').classList.add('is-invalid')
        return
    }

    const create_url = 'http://localhost:8080/lots/create'

    let formData = new FormData()
    formData.append('lotTitle', document.getElementById('lotTitle-create').value)
    formData.append('lotDescription', document.getElementById('lotDescription-create').value)
    formData.append('startingPrice', document.getElementById('startingPrice-create').value)
    formData.append('minimalStep', document.getElementById('minimalStep-create').value)
    if (document.getElementById('file-create').value != "") {
        formData.append('file', document.getElementById('file-create').files[0])
    }

    fetch(create_url, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`},
        body: formData
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            alert(`${data.message}`)
            bootstrap.Modal.getInstance(document.getElementById('create-modal')).hide()
            loadTable(document.getElementById('lots-table'), 'delete-buttons', 'redact-buttons')
        } else if (response.status == 400) {
            let data = await response.json()
            let fields = Object.keys(data)
            let errors = Object.values(data)
            for (let i = 0; i < fields.length; i++) {
                let errorEl = document.getElementById(`error-${fields[i]}-create`)
                errorEl.textContent = errors[i]
                errorEl.classList.remove('d-none')
                document.getElementById(`${fields[i]}-create`).classList.add('is-invalid')
            }
        } else if (response.status == 406) {
            let data = await response.json()
            let errorEl = document.getElementById('error-file-create')
            errorEl.textContent = data.error
            errorEl.classList.remove('d-none')
        }
    })

})

function createLotsTable(lotsData) {
    let html = `
    <tr>
        <th>Название лота</th>
        <th>Описание лота</th>
        <th>Начальная цена</th>
        <th>Минимальный шаг</th>
        <th>Название файла</th>
        <th>Расширение файла</th>
        <th colspan="2">Контроллеры</th>
    </tr>`
    for (let i = 0; i < lotsData.length; i++) {
        let additionalHtml = `
        <tr>
            <td>${lotsData[i].lotTitle}</td>
            <td>${lotsData[i].lotDescription}</td>
            <td>${lotsData[i].startingPrice}</td>
            <td>${lotsData[i].minimalStep}</td>
            <td>${lotsData[i].fileName}</td>
            <td>${lotsData[i].fileContentType}</td>
            <td><button class="btn btn-primary btn-sm" id="delete-button-${i}">Удалить</button></td>
            <td><button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#redact-modal"
             id="redact-button-${i}">Редактировать</button></td>
        </tr>`
        html += additionalHtml
    }
    return html
}

function addEventsToButtons(buttonType, lotsData) {
    switch (buttonType) {
        case 'delete-buttons':
            for (let i = 0; i < lotsData.length; i++) {
                document.getElementById(`delete-button-${i}`).addEventListener('click', () => {
                    let delete_url = `http://localhost:8080/lots/delete/${lotsData[i].id}`
                    fetch(delete_url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }).then(async response => {
                        if (response.ok) {
                            let data = await response.json()
                            alert(`Лот с названием ${lotsData[i].lotTitle} был удален`)
                            loadTable(document.getElementById('lots-table'), 'delete-buttons', 'redact-buttons')
                        }
                    })
                })
            }
            break
        case 'redact-buttons':
            for (let i = 0; i < lotsData.length; i++) {
                document.getElementById(`redact-button-${i}`).addEventListener('click', () => {
                    document.getElementById('lotTitle-redact').value = lotsData[i].lotTitle
                    document.getElementById('lotDescription-redact').value = lotsData[i].lotDescription
                    document.getElementById('startingPrice-redact').value = lotsData[i].startingPrice
                    document.getElementById('minimalStep-redact').value = lotsData[i].minimalStep
                    document.getElementById('selected-file-div').textContent = lotsData[i].fileName

                    document.getElementById('main-redact-button').addEventListener('click', () => {

                        document.querySelectorAll('.pole').forEach(element => element.classList.remove('is-invalid'))
                        document.querySelectorAll('.errors').forEach(element => element.classList.add('d-none'))

                        if (document.getElementById('lotDescription-redact').value.length > 500) {
                            let errorEl = document.getElementById(`error-lotDescription-redact`)
                            errorEl.textContent = 'Превышен максимум символов'
                            errorEl.classList.remove('d-none')
                            document.getElementById('lotDescription-redact').classList.add('is-invalid')
                            return
                        }

                        const redact_url = `http://localhost:8080/lots/redact/${lotsData[i].id}`

                        let formData = new FormData()
                        formData.append('lotTitle', document.getElementById('lotTitle-redact').value)
                        formData.append('lotDescription', document.getElementById('lotDescription-redact').value)
                        formData.append('startingPrice', document.getElementById('startingPrice-redact').value)
                        formData.append('minimalStep', document.getElementById('minimalStep-redact').value)
                        if (document.getElementById('file-redact').value != "") {
                            formData.append('file', document.getElementById('file-redact').files[0])
                        }


                        fetch(redact_url, {
                            method: 'PUT',
                            headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`},
                            body: formData
                        }).then(async response => {
                            if (response.ok) {
                                let data = await response.json()
                                alert(`${data.message}`)
                                bootstrap.Modal.getInstance(document.getElementById('redact-modal')).hide()
                                loadTable(document.getElementById('lots-table'), 'delete-buttons', 'redact-buttons')
                            } else if (response.status == 400) {
                                let data = await response.json()
                                let fields = Object.keys(data)
                                let errors = Object.values(data)
                                for (let i = 0; i < fields.length; i++) {
                                    let errorEl = document.getElementById(`error-${fields[i]}-redact`)
                                    errorEl.textContent = errors[i]
                                    errorEl.classList.remove('d-none')
                                    document.getElementById(`${fields[i]}-redact`).classList.add('is-invalid')
                                }
                            }
                        })
                    })
                })
            }
            break
        default:
            break
    }
}

function loadTable(tableEl, ...buttonTypes) {
    const users_data_url = 'http://localhost:8080/lots/all'
    fetch(users_data_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            tableEl.innerHTML = createLotsTable(data)
            for (let i = 0; i < buttonTypes.length; i++) {
                addEventsToButtons(buttonTypes[i], data)
            }
        } else if (response.status == 403) {
            document.location.replace('../html/sign_in.html')
        }
    })
}