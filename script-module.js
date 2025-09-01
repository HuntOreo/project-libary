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

  this.init = function () {
    this.displayFormBtn.addEventListener('click', () => {
      toggleForm(this.formContainer);
    });
    this.cancelBtn.addEventListener('click', () => {
      console.log(this.cancelBtn);
      cancelForm(this.formContainer, toggleForm);
    });
    this.submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      submitForm(this.formContainer, this.form, toggleForm);
    });
  }

  const toggleForm = function (form) {
    form.classList.toggle('show-form');
    form.classList.toggle('hide-overflow');
  }

  const cancelForm = function (form, toggleForm) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(element => element.value = '');

    toggleForm(form);
  }

  const submitForm = function (formContainer, form, toggleForm) {
    const formData = new FormData(form);
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

    storeBook(book);
    toggleForm(formContainer);
  }
}

const BookCoverForm = function ({
  formContainer,
  form,
  submitBtn,
  cancelBtn }) {

  Form.call(this, { formContainer, form, submitBtn, cancelBtn });
  this.input = document.querySelector('#cover-form input');

  this.setEvent = function (displayBtn, link) {
    displayBtn.addEventListener('click', () => {
      this.link = link;
      this.input.value = this.link;
      toggleForm(this.formContainer);
    });
  }

  this.init = function () {
    this.cancelBtn.addEventListener('click', () => {
      cancelForm(this.formContainer, this.input)
    });
  }

  const toggleForm = function (form) {
    form.classList.toggle('show-form');
    form.classList.toggle('hide-overflow');
  }

  function cancelForm(form, input) {
    input.value = "";
    toggleForm(form);
  }

}

Object.create(Form.prototype);
Object.setPrototypeOf(BookCoverForm.prototype, Form.prototype);

const Book = function (title, author, publishDate, cover) {
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


































let bookShelf = [];

// Bookshelf elements
const shelf = document.querySelector('.shelf')
const shelfContainerElm = document.createElement('div');
shelfContainerElm.classList.toggle('container');
shelf.appendChild(shelfContainerElm);

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


  coverForm.setEvent(coverWrapper, book.cover);

}

// Book handlers
function renderBooks() {
  shelf.firstElementChild.textContent = '';
  for (book of bookShelf) {
    buildBookCard(book);
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

coverForm.init();
addBookForm.init();
renderBooks();