document.addEventListener('DOMContentLoaded', () => {
    loadTable(document.getElementById('news-table'), 'delete-buttons', 'redact-buttons')
})

document.getElementById('text-create').addEventListener('input', () => {
    document.getElementById('label-text-create').textContent =
        `Описание лота (до 500 символов) (сейчас ${document.getElementById('text-create').value.length})`
})

document.getElementById('text-redact').addEventListener('input', () => {
    document.getElementById('label-text-redact').textContent =
        `Описание лота (до 500 символов) (сейчас ${document.getElementById('text-redact').value.length})`
})

document.getElementById('create-news-dialog-button').addEventListener('click', () => {
    document.querySelectorAll('.pole').forEach(element => element.classList.remove('is-invalid'))
    document.querySelectorAll('.errors').forEach(element => element.classList.add('d-none'))

    document.getElementById('title-create').value = ''
    document.getElementById('text-create').value = ''
    document.getElementById('image-create').value = ''
})

document.getElementById('create-news-button').addEventListener('click', () => {

    document.querySelectorAll('.pole').forEach(element => element.classList.remove('is-invalid'))
    document.querySelectorAll('.errors').forEach(element => element.classList.add('d-none'))

    if (document.getElementById('text-create').value.length > 2000) {
        let errorEl = document.getElementById(`error-text-create`)
        errorEl.textContent = 'Превышен максимум символов'
        errorEl.classList.remove('d-none')
        document.getElementById('text-create').classList.add('is-invalid')
        return
    }

    const create_url = 'http://localhost:8080/news/create'

    let formData = new FormData()
    formData.append('title', document.getElementById('title-create').value)
    formData.append('text', document.getElementById('text-create').value)
    if (document.getElementById('image-create').value != "") {
        formData.append('image', document.getElementById('image-create').files[0])
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
            loadTable(document.getElementById('news-table'), 'delete-buttons', 'redact-buttons')
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
            let errorEl = document.getElementById('error-image-create')
            errorEl.textContent = data.error
            errorEl.classList.remove('d-none')
        }
    })

})

function createNewsTable(newsData) {
    let html = `
    <tr>
        <th>Id</th>
        <th>Заголовок</th>
        <th>Текст</th>
        <th>Время создания</th>
        <th>Изменено</th>
        <th>Прикрепленное изображение</th>
        <th colspan="2">Контроллеры</th>
    </tr>`
    for (let i = 0; i < newsData.length; i++) {
        let additionalHtml = `
        <tr>
            <td>${newsData[i].id}</td>
            <td>${newsData[i].title}</td>
            <td>${newsData[i].text}</td>
            <td>${newsData[i].dateOfCreation}</td>
            <td>${newsData[i].redactered ? 'Да' : 'Нет'}</td>
            <td>${newsData[i].fileName == null ? 'Нет' : newsData[i].fileName}</td>
            <td><button class="btn btn-primary" id="delete-button-${i}">Удалить</button></td>
            <td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#redact-modal"
             id="redact-button-${i}">Редактировать</button></td>
        </tr>`
        html += additionalHtml
    }
    return html
}

function addEventsToButtons(buttonType, newsData) {
    switch (buttonType) {
        case 'delete-buttons':
            for (let i = 0; i < newsData.length; i++) {
                document.getElementById(`delete-button-${i}`).addEventListener('click', () => {
                    let delete_url = `http://localhost:8080/news/delete/${newsData[i].id}`
                    fetch(delete_url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }).then(async response => {
                        if (response.ok) {
                            let data = await response.json()
                            alert(`${data.message}`)
                            loadTable(document.getElementById('news-table'), 'delete-buttons', 'redact-buttons')
                        }
                    })
                })
            }
            break
        case 'redact-buttons':
            for (let i = 0; i < newsData.length; i++) {
                document.getElementById(`redact-button-${i}`).addEventListener('click', () => {

                    addActionToDeleteFileButton(newsData[i].id)

                    document.getElementById('title-redact').value = newsData[i].title
                    document.getElementById('text-redact').value = newsData[i].text
                    document.getElementById('selected-image-div').textContent =
                        newsData[i].fileName == null ? 'Изображение не выбрано' : `Текущее изображение: ${newsData[i].fileName}`

                    document.getElementById('main-redact-button').addEventListener('click', () => {

                        document.querySelectorAll('.pole').forEach(element => element.classList.remove('is-invalid'))
                        document.querySelectorAll('.errors').forEach(element => element.classList.add('d-none'))

                        if (document.getElementById('text-redact').value.length > 2000) {
                            let errorEl = document.getElementById(`error-text-redact`)
                            errorEl.textContent = 'Превышен максимум символов'
                            errorEl.classList.remove('d-none')
                            document.getElementById('text-redact').classList.add('is-invalid')
                            return
                        }

                        const redact_url = `http://localhost:8080/news/redact/${newsData[i].id}`

                        let formData = new FormData()
                        formData.append('title', document.getElementById('title-redact').value)
                        formData.append('text', document.getElementById('text-redact').value)
                        if (document.getElementById('image-redact').value != "") {
                            formData.append('image', document.getElementById('image-redact').files[0])
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
                                loadTable(document.getElementById('news-table'), 'delete-buttons', 'redact-buttons')
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
                            } else if (response.status == 406) {
                                let data = await response.json()
                                let errorEl = document.getElementById('error-image-redact')
                                errorEl.textContent = data.error
                                errorEl.classList.remove('d-none')
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
    const users_data_url = 'http://localhost:8080/news/all_table'
    fetch(users_data_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            tableEl.innerHTML = createNewsTable(data)
            for (let i = 0; i < buttonTypes.length; i++) {
                addEventsToButtons(buttonTypes[i], data)
            }
        } else if (response.status == 403) {
            document.location.replace('../html/profile.html')
        }
    })
}

function addActionToDeleteFileButton(id) {
    document.getElementById('delete-file-button').addEventListener('click', e => {
        e.preventDefault()
        let redact_image_url = `http://localhost:8080/news/redact_file/${id}`

        fetch(redact_image_url, {
            method: 'PUT',
            headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
        }).then(async response => {
            if (response.ok) {
                let data = await response.json()
                document.getElementById('selected-image-div').textContent = data.message
            }
        })
    })
}