let bookShelf = [];
const body = document.querySelector('body');
let selectedCover;

// Form elements
const showFormBtn = document.querySelector('.showFormBtn');
const addBookForm = document.querySelector('.add-book-form');
const updateCoverForm = document.querySelector('.update-cover-form');
const addBookBtn = document.querySelector('.addBookBtn');
const bookFormCancelBtn =
  document.querySelector('.add-book-form .cancelBtn');
const updateCoverCancelBtn =
  document.querySelector('.update-cover-form .cancelBtn');
const updateCoverBtn = document.querySelector('.updateCoverBtn');

// Bookshelf elements
const shelf = document.querySelector('.shelf')
const shelfContainerElm = document.createElement('div');
shelfContainerElm.classList.toggle('container');
shelf.appendChild(shelfContainerElm);

function Book(title, author, publishDate, cover) {
  this.title = title;
  this.author = author;
  this.publishDate = publishDate;
  this.cover = './img/placeholder.png'
  this.id = crypto.randomUUID();
  this.isRead = false;
  this.updateReadFlag = function () {
    this.isRead = !this.isRead;
  }
  this.updateCover = function (coverLink) {
    this.cover = coverLink;
  }

  if (cover) { this.cover = cover }
}

function storeBook({ title, author, publishDate, cover, readFlag }) {
  let book;
  if (cover === "") {
    book = new Book(title, author, publishDate);
  } else {
    book = new Book(title, author, publishDate, cover);
  }
  if (readFlag) { book.updateReadFlag() };

  bookShelf.push(book);
}

function buildBookCard(book) {
  // Build DOM elements
  const cardElm = document.createElement('div');
  const cardContainerElm = document.createElement('div');
  const deleteBtn = document.createElement('button');
  const buttonsWrapper = document.createElement('div');
  const readLabel = document.createElement('label');
  const toggleReadBox = document.createElement('input');
  const titleElm = document.createElement('h2');
  const coverWrapper = document.createElement('div');
  const coverElm = document.createElement('img');
  const coverUpdateIcon = document.createElement('img');
  const authorElm = document.createElement('p');
  const publishDateElm = document.createElement('p');

  toggleReadBox.type = "checkbox";
  toggleReadBox.checked = book.isRead;
  toggleReadBox.id = `readCheckbox-${book.id}`;
  readLabel.htmlFor = `readCheckbox-${book.id}`;

  // Assign CSS classes
  cardElm.classList.toggle('card');
  cardContainerElm.classList.toggle('container');
  deleteBtn.classList.toggle('deleteBtn');
  buttonsWrapper.classList.toggle('wrapper');
  toggleReadBox.classList.toggle('readBtn');
  titleElm.classList.toggle('title');
  coverWrapper.classList.toggle('wrapper');
  coverElm.classList.toggle('cover');
  coverUpdateIcon.classList.toggle('coverUpdateIcon');
  if (book.isRead) { cardElm.classList.toggle('read') }

  cardElm.dataset.id = book.id;

  // Populate element content
  deleteBtn.textContent = 'Delete';
  readLabel.textContent = 'Read'
  titleElm.textContent = book.title;
  authorElm.textContent = book.author;
  publishDateElm.textContent = book.publishDate;
  coverElm.src = book.cover;
  coverUpdateIcon.src = './img/icons/edit-img.svg';

  // Render DOM elements
  buttonsWrapper.appendChild(deleteBtn);
  buttonsWrapper.appendChild(readLabel);
  buttonsWrapper.appendChild(toggleReadBox);

  coverWrapper.appendChild(coverElm);
  coverWrapper.appendChild(coverUpdateIcon);
  shelfContainerElm.appendChild(cardElm);
  cardElm.appendChild(cardContainerElm);
  cardContainerElm.appendChild(buttonsWrapper);
  cardContainerElm.appendChild(titleElm);
  cardContainerElm.appendChild(coverWrapper);
  cardContainerElm.appendChild(authorElm);
  cardContainerElm.appendChild(publishDateElm);

  // Apply button functionality
  deleteBtn.addEventListener('click', () => deleteBook(cardElm));
  toggleReadBox.addEventListener('click', () => toggleRead(cardElm));
  coverWrapper.addEventListener('click', () => toggleCoverForm(book));
}

// Book handlers
function renderBooks() {
  shelf.firstElementChild.textContent = '';
  for (book of bookShelf) {
    buildBookCard(book);
  }
}

function deleteBook(bookCard) {
  const markedId = bookCard.dataset.id;
  const newBookShelf = bookShelf.filter(book => markedId !== book.id);

  bookShelf = [...newBookShelf];
  renderBooks();
}

function updateCover(selected) {
  const link = document.querySelector('#cover-form input').value;
  selected.updateCover(link);
  const index = bookShelf.indexOf(book => book.id === selected.id);
  bookShelf[index] = selected;
  toggleCoverForm();
  renderBooks();
}

function submitBook(event) {
  event.preventDefault();

  const bookForm = document.querySelector('#book-form');
  const formData = new FormData(bookForm);
  let bookInfo = {};

  for (entry of formData) {
    bookInfo[entry[0]] = entry[1];
  }

  const title = bookInfo["title"];
  const author = bookInfo["author"];
  const publishDate = bookInfo["publish-date"];
  let coverLink = bookInfo["cover-link"];
  let readFlag;
  bookInfo.readFlag ? readFlag = true : readFlag = false;

  const book = {
    "title": title,
    "author": author,
    "publishDate": publishDate,
    "coverLink": coverLink,
    "readFlag": readFlag,
  }

  storeBook(book);
  renderBooks();
}

// Toggle Functions
function toggleRead(bookCard) {
  bookCard.classList.toggle('read');
  const markedId = bookCard.dataset.id;
  const grabbedBook = bookShelf.filter(book => markedId === book.id)[0];

  grabbedBook.updateReadFlag();
  const index = bookShelf.findIndex(book => book.id === markedId);
  bookShelf[index] = grabbedBook;
}

function toggleBookForm() {
  addBookForm.classList.toggle('show-form');
  body.classList.toggle('hide-overflow');
}

function toggleCoverForm(book) {
  updateCoverForm.classList.toggle('show-form');
  body.classList.toggle('hide-overflow');
  selectedCover = book;
}

// Form button listeners
updateCoverCancelBtn.addEventListener('click', toggleCoverForm);
updateCoverBtn.addEventListener('click', (event) => {
  event.preventDefault();
  updateCover(selectedCover);
});
showFormBtn.addEventListener('click', toggleBookForm);
bookFormCancelBtn.addEventListener('click', toggleBookForm);
addBookBtn.addEventListener('click', (event) => {
  const requiredFields = document.querySelectorAll('input[required]');
  let requiredFlag = true;
  for (input of requiredFields) {
    if (input.value === '') {
      requiredFlag = false;
    }
  }

  if (requiredFlag) {
    submitBook(event);
    toggleBookForm();
  }
});

storeBook({
  "title": 'Dracula',
  "author": 'Bram Stoker',
  "publishDate": 1897,
  "cover": 'https://images-na.ssl-images-amazon.com/images/P/014143984X.01._SX450_SY635_SCLZZZZZZZ_.jpg'
});
storeBook({
  "title": 'The Hunger Games',
  "author": 'Suzanne Collins',
  "publishDate": 2008,
  "cover": 'https://images-na.ssl-images-amazon.com/images/P/0439023521.01._SX450_SY635_SCLZZZZZZZ_.jpg',
  "readFlag": true,
});

renderBooks();