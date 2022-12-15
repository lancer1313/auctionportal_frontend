document.addEventListener('DOMContentLoaded', () => {
    createNewsTimeline(document.getElementById('news-timeline'))
    setHTMLContent(document.getElementById('navbar'))
})

function createCard(newsEntity) {
    let html
    if (newsEntity.filePath != null) {
        html = `
        <div class="card mt-5 m-auto mb-3" style="width: 75%;">
            <div class="card-header">
                <h2 class="card-title">${newsEntity.title}</h2>
                <div class="card-subtitle">
                    Создана: <span>${newsEntity.dateOfCreation}</span> <span>${newsEntity.redactered ? '(редактировано)' : ''}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-text">${newsEntity.text}</div>
            </div>
            <img class="card-img-bottom" src="${newsEntity.filePath}">
        </div>`
    } else {
        html = `
        <div class="card mt-5 m-auto mb-3" style="width: 75%;">
            <div class="card-header">
                <h2 class="card-title">${newsEntity.title}</h2>
                <div class="card-subtitle">
                    Создана: <span>${newsEntity.dateOfCreation}</span> <span>${newsEntity.redactered ? '(редактировано)' : ''}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-text">${newsEntity.text}</div>
            </div>
        </div>`
    }
    return html
}

function createNewsTimeline(documentEl) {

    const news_timeline_url = 'http://localhost:8080/news/all_timeline'

    fetch(news_timeline_url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(async response => {
        if (response.ok) {
            let newsData = await response.json()
            for (let i = 0; i < newsData.length; i++) {
                documentEl.innerHTML += createCard(newsData[i])
            }
        }
    })
}

function setHTMLContent(documentEl) {
    let html
    if (sessionStorage.getItem('token') != '') {
        html = `
        <li class="nav-item">
            <a class="text-white text-decoration-none" href="html/profile.html">Личный кабинет</a>
        </li>`
    } else {
        html = `
        <li class="nav-item">
            <a class="text-white text-decoration-none" href="html/sign_up.html">Регистрация</a>
        </li>
        <li class="nav-item">
            <a class="text-white text-decoration-none" href="html/sign_in.html">Вход</a>
        </li>`
    }
    documentEl.innerHTML += html
}