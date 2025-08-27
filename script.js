let bookShelf = [];

function Book(title, author, publishDate) {
  this.title = title;
  this.author = author;
  this.publishDate = publishDate;
  this.id = crypto.randomUUID();
}

function storeBook(title, author, publishDate) {
  const book = new Book(title, author, publishDate);
  
  bookShelf.push(book);
}

function displayBooks() {
  const body = document.querySelector('body');
  const gridContainerElm = document.createElement('div');
  gridContainerElm.classList.toggle('container');

  body.appendChild(gridContainerElm);

  for (book of bookShelf) {

    const cardElm = document.createElement('div');
    const cardContainerElm = document.createElement('div');
    const titleElm = document.createElement('h2');
    const authorElm = document.createElement('p');
    const publishDateElm = document.createElement('p');

    cardElm.classList.toggle('card');
    cardContainerElm.classList.toggle('container');
    titleElm.classList.toggle('title');

    titleElm.innerText = book.title;
    authorElm.innerText = book.author;
    publishDateElm.innerText = book.publishDate;

    gridContainerElm.appendChild(cardElm);
    cardElm.appendChild(cardContainerElm);
    cardContainerElm.appendChild(titleElm);
    cardContainerElm.appendChild(authorElm);
    cardContainerElm.appendChild(publishDateElm);
  }
}

storeBook('Dracula', 'Bram Stoker', 1897);
storeBook('The Hunger Games', 'Suzanne Collins', 2008);
storeBook('The Catcher in the Rye', 'J. D. Salinger', 1951);
storeBook('Lolita', 'Vladimir Nabokov', 1955);
storeBook('The Lightning Thief', 'Rick Riordan', 2005);


displayBooks();