const elBooksTableBody = document.querySelector('.books')
const elNewBookBtn = document.querySelector('.new-book-btn')
const elModal = document.querySelector('.modal')
const elCloseModalBtn = document.querySelector('.close-modal-btn')
const addBookForm = document.querySelector('.new-book-form')

elNewBookBtn.addEventListener('click', openNewBookModal)
elCloseModalBtn.addEventListener('click', closeNewBookModal)
addBookForm.addEventListener('submit', addBookToLibrary)

let myLibrary = []

class Book {
  constructor(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
  }

  toggleRead() {
    (this.read === 'Read') ? this.read = 'Not Read' : this.read = 'Read'
  }
}

// Some Books 
const theAlchemist = new Book('The Alchemist', 'Paulo Coelho', 146, 'Read')
const theHobbit = new Book('The Hobbit', 'J. R. R. Tolkien', 310, 'Not Read')
const theCatcherInTheRye = new Book('The Catcher in the Rye', 'J. D. Salinger', 234, 'Read')
const oneHundredYearsOfSolitude = new Book('One Hundred Years of Solitude', 'Gabriel García Márquez', 369, 'Not Read')
myLibrary.push(theAlchemist, theHobbit, theCatcherInTheRye, oneHundredYearsOfSolitude)

function addBookToLibrary() {
  const form = document.querySelector('.new-book-form')
  const title = document.getElementById('title').value
  const author = document.getElementById('author').value
  const pages = Number(document.getElementById('pages').value)
  const read = document.getElementById('read').checked ? 'Read' : 'Not Read'

  const bookToAdd = new Book(title, author, pages, read)
  myLibrary.push(bookToAdd)
  displayLastBook()

  closeNewBookModal()
  form.reset()
  return false // Stop form submission
}

(function validateBookForm() {
  const author = document.getElementById('author')
  const pages = document.getElementById('pages')

  author.addEventListener('input', () => {
    if(author.validity.patternMismatch) {
      author.setCustomValidity('Author name cannot have numbers or special characters')
      author.reportValidity()
    } else {
      author.setCustomValidity('')
    }
  })

  pages.addEventListener('input', () => {
    if(pages.validity.stepMismatch) {
      pages.setCustomValidity('Page number must be a whole number')
      pages.reportValidity()
    } else if (pages.validity.rangeUnderflow) {
      pages.setCustomValidity('The book must have more than 24 pages')
      pages.reportValidity()
    } else {
      pages.setCustomValidity('')
    }
  })
})()

function insertBookRow(bookObject) {
  const newRow = elBooksTableBody.insertRow()

  Object.keys(bookObject).forEach((key) => {
    const newCell = newRow.insertCell()
    if (key === 'read') {
      createStatusButton(bookObject, newCell)
    } else {
      const newText = document.createTextNode(bookObject[key])
      newCell.appendChild(newText)
    }
  })
  createDeleteButton(newRow)
}

(function displayAllBooks() {
  myLibrary.forEach(book => insertBookRow(book))
})()

function displayLastBook() {
  const book = myLibrary.at(-1)
  insertBookRow(book)
}

function createDeleteButton(tableRow) {
  const button = document.createElement('button')
  button.innerHTML = 'Delete';
  button.classList.add('delete-btn', 'noselect')
  button.setAttribute('onclick', 'deleteBook(this)')
  const newCell = tableRow.insertCell()
  newCell.appendChild(button)
}

function deleteBook(deleteBtn) {
  const bookTitle = deleteBtn.parentNode.parentNode.firstElementChild.innerHTML
  const bookRow = deleteBtn.parentNode.parentNode.rowIndex - 1

  elBooksTableBody.deleteRow(bookRow)

  for (let i = myLibrary.length - 1; i >= 0; --i) {
    if (myLibrary[i].title === bookTitle) {
      myLibrary.splice(i, 1)
    }
  }
}

function createStatusButton(bookObject, tableCell) {
  const button = document.createElement('button')
  button.innerHTML = bookObject.read
  button.classList.add('status-btn', 'noselect')
  button.setAttribute('onclick', 'changeBookStatus(this)')
  tableCell.appendChild(button)
}

function changeBookStatus(statusBtn) {
  const bookTitle = statusBtn.parentNode.parentNode.firstElementChild.innerHTML

  for (let i = myLibrary.length - 1; i >= 0; --i) {
    if (myLibrary[i].title === bookTitle) {
      myLibrary[i].toggleRead()
      statusBtn.innerHTML = myLibrary[i].read
    }
  }
}

function openNewBookModal() {
  elModal.style.display = "flex"
}

function closeNewBookModal() {
  elModal.style.display = "none"
}