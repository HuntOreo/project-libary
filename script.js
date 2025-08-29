let bookShelf = [];
const body = document.querySelector('body');
const shelf = document.querySelector('.shelf')
const showFormBtn = document.querySelector('.showFormBtn');
const formContainer = document.querySelector('.form-container');
const addBookBtn = document.querySelector('.addBookBtn');
const cancelBtn = document.querySelector('.cancelBtn');

const gridContainerElm = document.createElement('div');
gridContainerElm.classList.toggle('container');
shelf.appendChild(gridContainerElm);

function Book(title, author, publishDate, cover) {
  this.title = title;
  this.author = author;
  this.publishDate = publishDate;
  this.cover = './img/placeholder.png'
  this.id = crypto.randomUUID();

  if (cover) {
    this.cover = cover
  }
}

function buildBookCard(book) {
  const cardElm = document.createElement('div');
  const cardContainerElm = document.createElement('div');
  const titleElm = document.createElement('h2');
  const coverElm = document.createElement('img');
  const authorElm = document.createElement('p');
  const publishDateElm = document.createElement('p');

  cardElm.classList.toggle('card');
  cardContainerElm.classList.toggle('container');
  titleElm.classList.toggle('title');
  coverElm.classList.toggle('cover');

  titleElm.innerText = book.title;
  authorElm.innerText = book.author;
  publishDateElm.innerText = book.publishDate;
  coverElm.src = book.cover;

  gridContainerElm.appendChild(cardElm);
  cardElm.appendChild(cardContainerElm);
  cardContainerElm.appendChild(titleElm);
  cardContainerElm.appendChild(coverElm);
  cardContainerElm.appendChild(authorElm);
  cardContainerElm.appendChild(publishDateElm);
}

function storeBook(title, author, publishDate, cover) {
  const book = new Book(title, author, publishDate, cover);
  bookShelf.push(book);
}

function renderBooks() {
  shelf.firstElementChild.textContent = '';
  console.log(bookShelf)
  for (book of bookShelf) {
    buildBookCard(book);
  }
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

  if (coverLink === "") {
    storeBook(title, author, publishDate);
  } else {
    storeBook(title, author, publishDate, coverLink);
  }

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

storeBook(
  'Dracula',
  'Bram Stoker',
  1897,
  'https://images-na.ssl-images-amazon.com/images/P/014143984X.01._SX450_SY635_SCLZZZZZZZ_.jpg'
);
storeBook(
  'The Hunger Games',
  'Suzanne Collins',
  2008,
  'https://images-na.ssl-images-amazon.com/images/P/0439023521.01._SX450_SY635_SCLZZZZZZZ_.jpg'
);
storeBook(
  'The Catcher in the Rye',
  'J. D. Salinger',
  1951,
  'https://images-na.ssl-images-amazon.com/images/P/0316769177.01._SX450_SY635_SCLZZZZZZZ_.jpg'
);
storeBook(
  'Lolita',
  'Vladimir Nabokov',
  1955,
  'https://images-na.ssl-images-amazon.com/images/P/0679723161.01._SX450_SY635_SCLZZZZZZZ_.jpg'
);
storeBook(
  'The Lightning Thief',
  'Rick Riordan',
  2005,
  'https://images-na.ssl-images-amazon.com/images/P/0786838655.01._SX450_SY635_SCLZZZZZZZ_.jpg'
);

renderBooks();
