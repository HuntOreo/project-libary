/*

  Build Book constructure
    The Book objects should have a unique id
      generate id using crypto.randomUUID()

  Declare a book function that takes some args
    use provided args to instantiate Book objects, then store inside an array

*/

let bookShelf = [];

function Book(name, author, publishDate) {
  this.name = name;
  this.author = author;
  this.publishDate = publishDate;
  this.id = crypto.randomUUID();
}

function storeBook(name, author, publishDate) {
  const book = new Book(name, author, publishDate);
  
  bookShelf.push(book);
}

storeBook('Dracula', 'Bram Stoker', 1897);

console.log(bookShelf);