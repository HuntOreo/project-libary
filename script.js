let bookShelf = [];
const body = document.querySelector('body');

// Form elements
const showFormBtn = document.querySelector('.showFormBtn');
const formContainer = document.querySelector('.form-container');
const addBookBtn = document.querySelector('.addBookBtn');
const cancelBtn = document.querySelector('.cancelBtn');

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

  if (cover) {
    this.cover = cover
  }

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
  const toggleReadBtn = document.createElement('button');
  const titleElm = document.createElement('h2');
  const coverElm = document.createElement('img');
  const authorElm = document.createElement('p');
  const publishDateElm = document.createElement('p');

  // Assign CSS classes
  cardElm.classList.toggle('card');
  cardContainerElm.classList.toggle('container');
  deleteBtn.classList.toggle('deleteBtn');
  toggleReadBtn.classList.toggle('readBtn');
  titleElm.classList.toggle('title');
  coverElm.classList.toggle('cover');

  if (book.isRead) {
    cardElm.classList.toggle('read')
  }

  cardElm.dataset.id = book.id;

  deleteBtn.innerText = 'Delete';
  toggleReadBtn.innerText = 'Mark as Read';
  titleElm.innerText = book.title;
  authorElm.innerText = book.author;
  publishDateElm.innerText = book.publishDate;
  coverElm.src = book.cover;

  deleteBtn.addEventListener('click', () => deleteBook(cardElm));
  toggleReadBtn.addEventListener('click', () => toggleRead(cardElm));

  // Render DOM elements
  shelfContainerElm.appendChild(cardElm);
  cardElm.appendChild(cardContainerElm);
  cardContainerElm.appendChild(deleteBtn);
  cardContainerElm.appendChild(toggleReadBtn);
  cardContainerElm.appendChild(titleElm);
  cardContainerElm.appendChild(coverElm);
  cardContainerElm.appendChild(authorElm);
  cardContainerElm.appendChild(publishDateElm);
}

function renderBooks() {
  shelf.firstElementChild.textContent = '';
  for (book of bookShelf) {
    buildBookCard(book);
  }
}

function deleteBook(bookCard) {
  const markedId = bookCard.dataset.id;
  const newBookShelf = bookShelf.filter(book => {
    if (markedId !== book.id) {
      return book;
    };
  });

  bookShelf = [...newBookShelf];
  renderBooks();
}

function toggleRead(bookCard) {
  const markedId = bookCard.dataset.id;
  const grabbedBook = bookShelf.filter(book => {
    if (markedId === book.id) {
      return book;
    };
  })[0];

  grabbedBook.updateReadFlag();

  const newBookShelf = bookShelf.map(book => {
    if (book.id === markedId) {
      return grabbedBook;
    } else {
      return book;
    }
  })

  bookShelf = [...newBookShelf];
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

  console.log(bookInfo);

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

function toggleForm() {
  formContainer.classList.toggle('show-form');
  body.classList.toggle('hide-overflow');
}

showFormBtn.addEventListener('click', toggleForm);
cancelBtn.addEventListener('click', toggleForm);
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
    toggleForm();
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
  "cover": 'https://images-na.ssl-images-amazon.com/images/P/0439023521.01._SX450_SY635_SCLZZZZZZZ_.jpg'
});
storeBook({
  "title": 'The Catcher in the Rye',
  "author": 'J. D. Salinger',
  "publishDate": 1951,
  "cover": 'https://images-na.ssl-images-amazon.com/images/P/0316769177.01._SX450_SY635_SCLZZZZZZZ_.jpg'
});
storeBook({
  "title": 'Lolita',
  "author": 'Vladimir Nabokov',
  "publishDate": 1955,
  "cover": 'https://images-na.ssl-images-amazon.com/images/P/0679723161.01._SX450_SY635_SCLZZZZZZZ_.jpg'
});
storeBook({
  "title": 'The Lightning Thief',
  "author": 'Rick Riordan',
  "publishDate": 2005,
  "cover": 'https://images-na.ssl-images-amazon.com/images/P/0786838655.01._SX450_SY635_SCLZZZZZZZ_.jpg'
});

renderBooks();
