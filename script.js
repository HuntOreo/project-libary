let bookShelf = [];
const addBookBtn = document.querySelector('.addBookBtn');

function Book(title, author, publishDate, cover) {
  this.title = title;
  this.author = author;
  this.publishDate = publishDate;
  this.cover = cover;
  this.id = crypto.randomUUID();
}

function storeBook(title, author, publishDate, cover) {
  const book = new Book(title, author, publishDate, cover);

  bookShelf.push(book);
}

// Render books onto page
function displayBooks() {
  const body = document.querySelector('body');
  const gridContainerElm = document.createElement('div');
  gridContainerElm.classList.toggle('container');

  body.appendChild(gridContainerElm);

  for (book of bookShelf) {

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
    console.log(book.cover);
    coverElm.src = book.cover;

    gridContainerElm.appendChild(cardElm);
    cardElm.appendChild(cardContainerElm);
    cardContainerElm.appendChild(titleElm);
    cardContainerElm.appendChild(coverElm);
    cardContainerElm.appendChild(authorElm);
    cardContainerElm.appendChild(publishDateElm);
  }
}

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

displayBooks();