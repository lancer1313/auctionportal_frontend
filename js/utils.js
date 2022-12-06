function makeRelocateButton(buttonId, pageUrl) {
    document.getElementById(buttonId).addEventListener('click', () => {
        document.location.href = pageUrl
    })
}