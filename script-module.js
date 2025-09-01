const Form = function ({
  formContainer,
  form,
  submitBtn,
  cancelBtn,
  displayFormBtn }) {

  this.formContainer = document.querySelector(formContainer);
  this.form = document.querySelector(form);
  this.submitBtn = document.querySelector(submitBtn);
  this.cancelBtn = document.querySelector(cancelBtn);
  this.displayFormBtn = document.querySelector(displayFormBtn);

  this.init = function (shelf) {
    this.displayFormBtn.addEventListener('click', () => {
      toggle(this.formContainer);
    });
    this.cancelBtn.addEventListener('click', () => {
      cancel(this.formContainer, toggle);
    });
    this.submitBtn.addEventListener('click', (event) => {
      if (requiredCheck(this.form)) {
        event.preventDefault();
        this.submit(shelf);
      }
    });
  }

  const toggle = function (form) {
    form.classList.toggle('show-form');
    form.classList.toggle('hide-overflow');
  }

  const cancel = function (form, toggleForm) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(element => element.value = '');

    toggle(form);
  }

  const requiredCheck = function (form) {
    const inputs = form.querySelectorAll('input[required]');

    let requiredFlag = true;
    for (input of inputs) {
      if (input.value === '') {
        requiredFlag = false;
      }
    }

    return requiredFlag;
  }

  this.submit = function (shelf) {
    const formData = new FormData(this.form);
    let bookInfo = {};

    for (entry of formData) {
      bookInfo[entry[0]] = entry[1];
    }

    const { title, author } = bookInfo;
    const publishDate = bookInfo["publish-date"];
    const coverLink = bookInfo["cover-link"];
    let readFlag;
    bookInfo.readFlag ? readFlag = true : readFlag = false;

    const book = {
      title,
      author,
      publishDate,
      coverLink,
      readFlag,
    };

    shelf.addBook(book)
    toggle(this.formContainer);
  }
}

const BookCoverForm = function ({
  formContainer,
  form,
  submitBtn,
  cancelBtn }) {

  Form.call(this, { formContainer, form, submitBtn, cancelBtn });
  this.input = document.querySelector('#cover-form input');

  this.setEvent = function (displayBtn, book) {
    displayBtn.addEventListener('click', () => {
      this.book = book;
      this.input.value = this.book.cover;
      toggleForm(this.formContainer);
    });
  }

  this.init = function () {
    this.cancelBtn.addEventListener('click', () => {
      cancelForm(this.formContainer, this.input)
    });

    this.submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      submitForm(this.book, this.input);
    });
  }

  const toggleForm = function (form) {
    form.classList.toggle('show-form');
    form.classList.toggle('hide-overflow');
  }

  const cancelForm = function (form, input) {
    input.value = "";
    toggleForm(form);
  }

  const submitForm = function (book, input) {
    let newBook = { ...book };
    newBook.updateCover(input.value);
    const newShelf = bookShelf.map(child => {
      if (child.id === newBook.id) {
        return newBook;
      }

      return child;
    })
    bookShelf = [...newShelf];
  }
}

Object.create(Form.prototype);
Object.setPrototypeOf(BookCoverForm.prototype, Form.prototype);

const Shelf = function (selector) {
  this.selector = selector;
  this.books = [];
  const shelfElement = document.querySelector(selector);

  this.set = function (booksArr) {
    const books = booksArr.map(book => new Book({ ...book }));
    this.books = books;
  }

  this.get = function () {
    return this.books;
  }

  this.getBook = function (selectedID) {
    return this.books.filter((book, index) => {
      if (book.id !== selectedID) return { index, book }
    });
  }

  this.updateBook = function (newBook, selectedID) {
    const index = this.getBook(selectedID).index;
    let newBooks = [...this.books];
    newBooks[index] = newBook;
    this.books = newBooks;
    this.render();
  }

  this.init = function (form) {
    this.form = form
    this.container = document.createElement('div');
    this.container.classList.toggle('container');
    shelfElement.appendChild(this.container);
  }

  this.addBook = function ({ title, author, publishDate, cover, readFlag }) {
    const book = new Book({
      title,
      author,
      publishDate,
      cover,
      readFlag
    });

    if (readFlag) {
      book.updateReadFlag();
    };

    this.books.push(book);
    this.render();
  }

  this.render = function () {
    shelfElement.firstElementChild.textContent = '';
    for (book of this.books) {
      buildBookCard(book, this);
    }
  }

  this.removeBook = function (card, shelf) {
    const selectedID = card.dataset.id;
    const newShelf = shelf.books.filter(book => book.id !== selectedID);
    shelf.set(newShelf);
    shelf.render();
  }

  const buildBookCard = function (book, shelf) {
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
    shelf.container.appendChild(cardElm);
    cardElm.appendChild(cardContainerElm);
    cardContainerElm.appendChild(buttonsWrapper);
    cardContainerElm.appendChild(titleElm);
    cardContainerElm.appendChild(coverWrapper);
    cardContainerElm.appendChild(authorElm);
    cardContainerElm.appendChild(publishDateElm);

    shelf.form.setEvent(coverWrapper, book);
    deleteBtn.addEventListener('click', () => {
      shelf.removeBook(cardElm, shelf)
    });
    toggleReadBox.addEventListener('click', () => {
      book.updateReadFlag();
      shelf.updateBook(book);
    })
  }
}

const Book = function ({ title, author, publishDate, cover }) {
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

const addBookForm = new Form({
  formContainer: '.add-book-form',
  form: '#book-form',
  submitBtn: '.addBookBtn',
  cancelBtn: '#book-form .cancelBtn',
  displayFormBtn: 'header .showFormBtn'
});
const coverForm = new BookCoverForm({
  formContainer: '.update-cover-form',
  form: '#cover-form',
  submitBtn: '.updateCoverBtn',
  cancelBtn: '#cover-form .cancelBtn',
});
const shelf = new Shelf('.shelf');

const booksArr = [
  {
    "title": 'The Hunger Games',
    "author": 'Suzanne Collins',
    "publishDate": 2008,
    "cover": 'https://images-na.ssl-images-amazon.com/images/P/0439023521.01._SX450_SY635_SCLZZZZZZZ_.jpg',
    "readFlag": true,
  },
  {
    "title": 'Dracula',
    "author": 'Bram Stoker',
    "publishDate": 1897,
    "cover": 'https://images-na.ssl-images-amazon.com/images/P/014143984X.01._SX450_SY635_SCLZZZZZZZ_.jpg'
  }
]

coverForm.init();
shelf.init(coverForm);
addBookForm.init(shelf);

shelf.set(booksArr);
shelf.render();
shelf.addBook(
  {
    title: 'The Lightning Thief',
    author: 'Rick Riordan',
    publishDate: 1897,
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1400602609i/28187.jpg'
  }
);