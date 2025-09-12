class Form {
  constructor({
    container,
    form,
    submitBtn,
    cancelBtn,
    displayBtn
  }, shelf) {
    this._shelf = shelf;
    this._container = document.querySelector(container);
    this._form = document.querySelector(form);
    this._submitBtn = document.querySelector(submitBtn);
    this._cancelBtn = document.querySelector(cancelBtn);
    if (displayBtn) this._displayBtn = document.querySelector(displayBtn);

    this._cancelBtn.addEventListener('click', () => { this.cancel(); });
    this._submitBtn.addEventListener('click', (event) => {
      if (this.#requiredCheck(this._form)) {
        event.preventDefault();
        this.submit();
      }
    });
    if (displayBtn) {
      this._displayBtn.addEventListener('click', () => { this.toggle(); });
    };
  }

  get container() {
    return this._container;
  }

  #requiredCheck(form) {
    const inputs = form.querySelectorAll('input[required]');
    let requiredFlag = true;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value === '') { requiredFlag = false; }
    }

    return requiredFlag;
  }

  toggle() {
    this._container.classList.toggle('show-form');
    this._container.classList.toggle('hide-overflow');
  }

  cancel() {
    const inputs = this._form.querySelectorAll('input');
    inputs.forEach(element => element.value = '');

    this.toggle();
  }

  submit() {
    const formData = new FormData(this._form);
    let bookInfo = {};

    for (const entry of formData.entries()) {
      bookInfo[entry[0]] = entry[1];
    }

    const { title, author } = bookInfo;
    const publishDate = bookInfo["publish-date"];
    const cover = bookInfo["cover-link"];
    let readFlag;
    bookInfo.readFlag ? readFlag = true : readFlag = false;

    const book = {
      title,
      author,
      publishDate,
      cover,
      readFlag,
    };

    this._shelf.addBook(book).render();
    this.toggle();
  }
}

class Book {
  constructor({ title, author, publishDate, cover, readFlag }) {
    this.title = title;
    this.author = author;
    this.publishDate = publishDate;
    cover ? this.cover = cover : this.cover = './img/placeholder.png';
    readFlag ? this.isRead = readFlag : this.isRead = false;
    this.id = crypto.randomUUID();
  }

  updateReadFlag() {
    this.isRead = !this.isRead;
  }

  updateCover(link) {
    this.cover = link;
  }
}

class BookCard {
  constructor(book, shelf) {
    this.book = book;
    this._shelf = shelf;
    this._container = this._shelf.container;

    const content = this._shelf.template.content;
    const clone = content.cloneNode(true);

    this._card = clone.querySelector('.card');
    this._deleteBtn = clone.querySelector('.deleteBtn');
    this._label = clone.querySelector('label');
    this._checkBox = clone.querySelector('.readBtn');
    this._title = clone.querySelector('.title');
    this._cover = clone.querySelector('.cover');
    this._coverIcon = clone.querySelector('.coverUpdateIcon');
    this._author = clone.querySelector('.author');
    this._date = clone.querySelector('.date');

    if (book.isRead) {
      this._card.classList.add('read');
      this._checkBox.checked = book.isRead;
    }
    this.#populateElements();
    this.#assignID();
  }

  get form() {
    return this._form;
  }

  set form(form) {
    this._form = form;
  }

  #assignID() {
    this._card.dataset.id = this.book.id;
    this._checkBox.id = `readCheckbox-${this.book.id}`;
    this._label.htmlFor = `readCheckbox-${this.book.id}`;
  }

  #populateElements() {
    this._deleteBtn.textContent = 'Delete';
    this._label.textContent = 'Read'
    this._title.textContent = this.book.title;
    this._cover.src = this.book.cover;
    this._coverIcon.src = './img/icons/edit-img.svg';
    this._author.textContent = this.book.author;
    this._date.textContent = this.book.publishDate;
  }

  #attachEvents() {
    this._deleteBtn.addEventListener('click', () => {
      this._shelf.removeBook(this._card, this._shelf).render();
    });
    this._checkBox.addEventListener('click', () => {
      this.book.updateReadFlag();
      this._shelf.updateBook(this.book);
      this._checkBox.checked = this.book.isRead;
      this._card.classList.toggle('read');
    })
    this._coverIcon.addEventListener('click', () => {
      this.form.container.classList.toggle('show-form');
    })
  }

  render() {
    this.#attachEvents()
    this._container.appendChild(this._card);
  }
}

class Shelf {
  #books = [];
  constructor() {
    this.template = document.querySelector('#card-template');
    const shelfEl = document.querySelector('.shelf');

    this.container = document.createElement('div');
    this.container.classList.add('container');

    shelfEl.appendChild(this.container);
  }

  set books(arr) {
    this.#books = arr.map(book => new Book({ ...book }));
  }

  get books() {
    return this.#books;
  }

  set container(element) {
    this._container = element;
  }

  get container() {
    return this._container;
  }

  set form(obj) {
    this._form = obj;
  }

  getBook(id) {
    return this.#books.filter((book, index) => {
      if (book.id !== id) return { index, book }
    });
  }

  updateBook(newBook, id) {
    const index = this.getBook(id).index;
    let newBooks = [...this.#books];
    newBooks[index] = newBook;
    this.#books = newBooks;
    return this;
  }

  addBook({ title, author, publishDate, cover, readFlag }) {
    const book = new Book({
      title,
      author,
      publishDate,
      cover,
      readFlag
    });

    this.#books.push(book);
    return this;
  }

  removeBook(card) {
    const id = card.dataset.id;
    const newBooks = this.#books.filter(book => book.id !== id);
    this.#books = newBooks;
    return this;
  }

  render() {
    this.container.textContent = '';
    for (let i = 0; i < this.#books.length; i++) {
      const book = new BookCard(this.#books[i], this);
      book.form = this._form;
      book.render(this._form);
    }
  }
}

const shelf = new Shelf();

const addBookForm = new Form({
  container: '.add-book-form',
  form: '#book-form',
  submitBtn: '.addBookBtn',
  cancelBtn: '#book-form .cancelBtn',
  displayBtn: 'header .showFormBtn',
}, shelf);

const coverForm = new Form({
  container: '.update-cover-form',
  form: '#cover-form',
  submitBtn: '.updateCoverBtn',
  cancelBtn: '#cover-form .cancelBtn',
}, shelf);

shelf.addBook(
  {
    title: 'The Lightning Thief',
    author: 'Rick Riordan',
    publishDate: 1897,
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1400602609i/28187.jpg'
  }
)

shelf.form = coverForm;
shelf.render();