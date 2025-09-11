class Form {
  #shelf
  #container
  form
  #submitBtn
  #cancelBtn
  #displayBtn

  constructor({
    container,
    form,
    submitBtn,
    cancelBtn,
    displayBtn
  }, shelf) {
    console.log(shelf)
    this.#shelf = shelf;
    this.#container = document.querySelector(container);
    this.form = document.querySelector(form);
    this.#submitBtn = document.querySelector(submitBtn);
    this.#cancelBtn = document.querySelector(cancelBtn);
    if (displayBtn) this.#displayBtn = document.querySelector(displayBtn);

    this.#cancelBtn.addEventListener('click', () => { this.cancel(); });
    this.#submitBtn.addEventListener('click', (event) => {
      if (this.#requiredCheck(this.form)) {
        event.preventDefault();
        this.submit();
      }
    });
    if (displayBtn) {
      this.#displayBtn.addEventListener('click', () => { this.toggle(); });
    }
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
    this.#container.classList.toggle('show-form');
    this.#container.classList.toggle('hide-overflow');
  }

  cancel() {
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(element => element.value = '');

    this.toggle();
  }

  submit() {
    const formData = new FormData(this.form);
    let bookInfo = {};

    for (let i = 0; i < formData.length; i++) {
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

    this.#shelf.addBook(book).render();
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
  // Variables
  #shelf; #cardElm; #cardContainerElm; #deleteBtn; #buttonsWrapper;
  #readLabel; #toggleReadBox; #titleElm; #coverWrapper; #coverElm;
  #coverUpdateIcon; #authorElm; #publishDateElm;
  constructor(book, shelf) {
    this.book = book;
    this.#shelf = shelf;
    this.#cardElm = document.createElement('div');
    this.#cardContainerElm = document.createElement('div');
    this.#deleteBtn = document.createElement('button');
    this.#buttonsWrapper = document.createElement('div');
    this.#readLabel = document.createElement('label');
    this.#toggleReadBox = document.createElement('input');
    this.#titleElm = document.createElement('h2');
    this.#coverWrapper = document.createElement('div');
    this.#coverElm = document.createElement('img');
    this.#coverUpdateIcon = document.createElement('img');
    this.#authorElm = document.createElement('p');
    this.#publishDateElm = document.createElement('p');

    this.#handleReadBox();
    this.#assignClasses();

    // Assign ID
    this.#cardElm.dataset.id = this.book.id;

    this.#populateElements();
    this.#attachEvents();
  }

  #handleReadBox() {
    this.#toggleReadBox.type = "checkbox";
    this.#toggleReadBox.checked = this.book.isRead;
    this.#toggleReadBox.id = `readCheckbox-${this.book.id}`;
    this.#readLabel.htmlFor = `readCheckbox-${this.book.id}`;
  }

  #assignClasses() {
    this.#cardElm.classList.toggle('card');
    this.#cardContainerElm.classList.toggle('container');
    this.#deleteBtn.classList.toggle('deleteBtn');
    this.#buttonsWrapper.classList.toggle('wrapper');
    this.#toggleReadBox.classList.toggle('readBtn');
    this.#titleElm.classList.toggle('title');
    this.#coverWrapper.classList.toggle('wrapper');
    this.#coverElm.classList.toggle('cover');
    this.#coverUpdateIcon.classList.toggle('coverUpdateIcon');
    if (this.book.isRead) { this.#cardElm.classList.toggle('read') }
  }

  #populateElements() {
    this.#deleteBtn.textContent = 'Delete';
    this.#readLabel.textContent = 'Read'
    this.#titleElm.textContent = this.book.title;
    this.#authorElm.textContent = this.book.author;
    this.#publishDateElm.textContent = this.book.publishDate;
    this.#coverElm.src = this.book.cover;
    this.#coverUpdateIcon.src = './img/icons/edit-img.svg';
  }

  #attachEvents() {
    this.#deleteBtn.addEventListener('click', () => {
      this.#shelf.removeBook(this.#cardElm, this.#shelf).render();
    });
    this.#toggleReadBox.addEventListener('click', () => {
      this.book.updateReadFlag();
      this.#shelf.updateBook(this.book).render();
    })
  }

  render() {
    this.#buttonsWrapper.appendChild(this.#deleteBtn);
    this.#buttonsWrapper.appendChild(this.#readLabel);
    this.#buttonsWrapper.appendChild(this.#toggleReadBox);
    this.#coverWrapper.appendChild(this.#coverElm);
    this.#coverWrapper.appendChild(this.#coverUpdateIcon);
    this.#shelf.container.appendChild(this.#cardElm);
    this.#cardElm.appendChild(this.#cardContainerElm);
    this.#cardContainerElm.appendChild(this.#buttonsWrapper);
    this.#cardContainerElm.appendChild(this.#titleElm);
    this.#cardContainerElm.appendChild(this.#coverWrapper);
    this.#cardContainerElm.appendChild(this.#authorElm);
    this.#cardContainerElm.appendChild(this.#publishDateElm);
  }
}

class Shelf {
  #container;
  #books = [];
  constructor() {
    this.element = document.querySelector('.shelf');

    const containerEl = document.createElement('div');
    containerEl.classList.add('container');

    this.container = containerEl;
    document.querySelector('.shelf').appendChild(this.container);
  }

  set books(arr) {
    this.#books = arr.map(book => new Book({ ...book }));
  }

  get books() {
    return this.#books;
  }

  set container(element) {
    this.#container = element;
  }

  get container() {
    return this.#container;
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
    // this.element.textContent = '';
    for (let i = 0; i < this.#books.length; i++) {
      const book = new BookCard(this.#books[i], this);
      book.render();
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

shelf.render();