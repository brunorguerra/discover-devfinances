const modal = {
    open() {
        document.getElementById('modal-overlay').classList.add('active-modal')
    },
    close() {
        document.getElementById('modal-overlay').classList.remove('active-modal')
    }
}

document.querySelector('.button.new').addEventListener('click', () => {
    modal.open()
})
document.querySelector('.modal-form .input-group.actions .button.cancel').addEventListener('click', () => {
    modal.close()
})