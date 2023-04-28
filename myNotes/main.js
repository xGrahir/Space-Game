const addBtn = document.querySelector('.add')
const removeBtn = document.querySelector('.remove-all')
const PopUp = document.querySelector('.wrapper')
const notes = document.querySelector('.notes')
const acceptBtn = document.querySelectorAll('.add-btns')
const selectType = document.querySelector('.select-type')
const noteText = document.querySelector('.note-text')
const noteTitle = document.querySelector('.note-title')
const errorMsg = document.querySelector('.error')
const removeAll = document.querySelector('.remove-all')
const emptyInfo = document.querySelector('.empty')

const main = () => {
	checkIfEmpty()
	handleDelete()
}

const showPopUp = () => {
	PopUp.classList.add('wrapper-show')
}

const checkInputs = () => {
	if (noteText.value == '' || selectType.value == 'none' || noteTitle.value == '') {
		errorMsg.classList.add('error-show')
	} else {
		errorMsg.classList.remove('error-show')
		addNote()
	}
}

const checkTypeOfNote = () => {
	if (selectType.value == 'shopping') {
		return 'note-green'
	}

	if (selectType.value == 'job') {
		return 'note-red'
	}

	if (selectType.value == 'other') {
		return 'note-yellow'
	}
}

const addNote = () => {
	const div = document.createElement('div')
	const btn = document.createElement('button')
	const title = document.createElement('h2')
	const parag = document.createElement('p')

	const type = checkTypeOfNote()
	div.classList.add('note', type)
	btn.innerHTML = '<i class="fa-solid fa-x"></i>'
	title.textContent = noteTitle.value
	parag.textContent = noteText.value
	notes.appendChild(div)
	div.appendChild(btn)
	div.appendChild(title)
	div.appendChild(parag)
	emptyInfo.classList.add('empty-hidden')
	noteTitle.value = ''
	noteText.value = ''
	PopUp.classList.remove('wrapper-show')
	handleDelete()
}

const menagePopUpButtons = e => {
	const btnClass = e.target.classList[0]
	if (btnClass == 'add-note-btn') {
		checkInputs()
	}

	if (btnClass == 'cancel-add-btn') {
		PopUp.classList.remove('wrapper-show')
	}
}

const checkIfEmpty = () => {
	if (notes.children.length == 0) {
		emptyInfo.classList.remove('empty-hidden')
	} else {
        emptyInfo.classList.add('empty-hidden')
    }
}

const deleteOne = e => {
	const note = e.target.closest('.note')
	note.remove()
	checkIfEmpty()
}

const handleDelete = () => {
	deleteNoteBtn = document.querySelectorAll('.notes .note button')
	deleteNoteBtn.forEach(btn => btn.addEventListener('click', deleteOne))
}

addBtn.addEventListener('click', showPopUp)
acceptBtn.forEach(acceptBtn => acceptBtn.addEventListener('click', menagePopUpButtons))
removeAll.addEventListener('click', () => {
	notes.textContent = ''
	checkIfEmpty()
})

main()
