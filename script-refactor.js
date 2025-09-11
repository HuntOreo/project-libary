class Form {
  constructor({
    container,
    form,
    submitBtn,
    cancelBtn,
    displayBtn
  }, shelf) {
    console.log(shelf)
    this._shelf = shelf;
    this._container = document.querySelector(container);
    this._form = document.querySelector(form);
    this._submitBtn = document.querySelector(submitBtn);
    this._cancelBtn = document.querySelector(cancelBtn);
    console.log(cancelBtn);
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

// TODO //
// refactor code to utalize the <template> html tag for simplifed dom manipulation.
class BookCard {
  constructor(book, shelf) {
    this.book = book;
    this._shelf = shelf;
    this._cardElm = document.createElement('div');
    this._cardContainerElm = document.createElement('div');
    this._deleteBtn = document.createElement('button');
    this._buttonsWrapper = document.createElement('div');
    this._readLabel = document.createElement('label');
    this._toggleReadBox = document.createElement('input');
    this._titleElm = document.createElement('h2');
    this._coverWrapper = document.createElement('div');
    this._coverElm = document.createElement('img');
    this._coverUpdateIcon = document.createElement('img');
    this._authorElm = document.createElement('p');
    this._publishDateElm = document.createElement('p');

    this.#handleReadBox();
    this.#assignClasses();

    // Assign ID
    this._cardElm.dataset.id = this.book.id;

    this.#populateElements();
    this.#attachEvents();
  }

  #handleReadBox() {
    this._toggleReadBox.type = "checkbox";
    this._toggleReadBox.checked = this.book.isRead;
    this._toggleReadBox.id = `readCheckbox-${this.book.id}`;
    this._readLabel.htmlFor = `readCheckbox-${this.book.id}`;
  }

  #assignClasses() {
    this._cardElm.classList.toggle('card');
    this._cardContainerElm.classList.toggle('container');
    this._deleteBtn.classList.toggle('deleteBtn');
    this._buttonsWrapper.classList.toggle('wrapper');
    this._toggleReadBox.classList.toggle('readBtn');
    this._titleElm.classList.toggle('title');
    this._coverWrapper.classList.toggle('wrapper');
    this._coverElm.classList.toggle('cover');
    this._coverUpdateIcon.classList.toggle('coverUpdateIcon');
    if (this.book.isRead) { this._cardElm.classList.toggle('read') }
  }

  #populateElements() {
    this._deleteBtn.textContent = 'Delete';
    this._readLabel.textContent = 'Read'
    this._titleElm.textContent = this.book.title;
    this._authorElm.textContent = this.book.author;
    this._publishDateElm.textContent = this.book.publishDate;
    this._coverElm.src = this.book.cover;
    this._coverUpdateIcon.src = './img/icons/edit-img.svg';
  }

  #attachEvents() {
    this._deleteBtn.addEventListener('click', () => {
      this._shelf.removeBook(this._cardElm, this._shelf).render();
    });
    this._toggleReadBox.addEventListener('click', () => {
      this.book.updateReadFlag();
      this._shelf.updateBook(this.book).render();
    })
  }

  render() {
    this._buttonsWrapper.appendChild(this._deleteBtn);
    this._buttonsWrapper.appendChild(this._readLabel);
    this._buttonsWrapper.appendChild(this._toggleReadBox);
    this._coverWrapper.appendChild(this._coverElm);
    this._coverWrapper.appendChild(this._coverUpdateIcon);
    this._shelf.container.appendChild(this._cardElm);
    this._cardElm.appendChild(this._cardContainerElm);
    this._cardContainerElm.appendChild(this._buttonsWrapper);
    this._cardContainerElm.appendChild(this._titleElm);
    this._cardContainerElm.appendChild(this._coverWrapper);
    this._cardContainerElm.appendChild(this._authorElm);
    this._cardContainerElm.appendChild(this._publishDateElm);
  }
}

class Shelf {
  #books = [];
  constructor() {
    this.template = document.querySelector('#card-template');
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
    this._container = element;
  }

  get container() {
    return this._container;
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
