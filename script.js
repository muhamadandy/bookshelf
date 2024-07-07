document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("book-form");
  const bookList = document.getElementById("book-list");
  const allBooksTab = document.getElementById("all-books");
  const readBooksTab = document.getElementById("read-books");
  const unreadBooksTab = document.getElementById("unread-books");
  const searchInput = document.getElementById("search");
  let editingBookId = null;

  // Funsi untuk mengambil buku dari localstorage
  function getBooksFromStorage() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  // Fungsi untu menampilkan buku
  function displayBooks(books) {
    bookList.innerHTML = "";

    books.forEach(function (book) {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book-item");
      if (book.isComplete) {
        bookItem.classList.add("completed");
      }
      bookItem.dataset.id = book.id;
      bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Penulis:</strong> ${book.author}</p>
            <p><strong>Tahun:</strong> ${book.year}</p>
            <p><strong>Status:</strong> ${
              book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"
            }</p>
            <button class="btn btn-delete" data-id="${book.id}">Delete</button>
            <button class="btn btn-edit" data-id="${book.id}">Edit</button>
          `;
      bookList.appendChild(bookItem);
    });
  }

  // fungsi untuk menambah buku ke localstorage
  function addBookToStorage(book) {
    const books = getBooksFromStorage();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Fungsi untuk mengedit buku
  function updateBookInStorage(book) {
    const books = getBooksFromStorage();
    const index = books.findIndex((item) => item.id === book.id);
    if (index !== -1) {
      books[index] = book;
      localStorage.setItem("books", JSON.stringify(books));
    }
  }

  // Fungsi untuk menghapus buku
  function removeBookFromStorage(id) {
    const books = getBooksFromStorage();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      localStorage.setItem("books", JSON.stringify(books));
    }
  }

  // eventlistener untuk submit hasil edit
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isComplete = document.querySelector('input[type="checkbox"]').checked;

    if (editingBookId !== null) {
      const book = { id: editingBookId, title, author, year, isComplete };
      updateBookInStorage(book);
      editingBookId = null;
    } else {
      const id = Date.now().toString(); // Generate unique id
      const book = {
        id,
        title,
        author,
        year: Number(year),
        isComplete,
      };
      addBookToStorage(book);
    }

    form.reset();
    displayBooks(getBooksFromStorage());
  });

  // eventlistener submit untuk menambah buku
  bookList.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-delete")) {
      const id = event.target.dataset.id;
      removeBookFromStorage(id);
      displayBooks(getBooksFromStorage());
    } else if (event.target.classList.contains("btn-edit")) {
      const id = event.target.dataset.id;
      const book = getBooksFromStorage().find((item) => item.id === id);
      if (book) {
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("year").value = book.year;
        document.querySelector('input[type="checkbox"]').checked =
          book.isComplete;
        editingBookId = id;
      }
    }
  });

  // Tab untuk melihat buku
  allBooksTab.addEventListener("click", function () {
    allBooksTab.classList.add("active");
    readBooksTab.classList.remove("active");
    unreadBooksTab.classList.remove("active");
    displayBooks(getBooksFromStorage());
  });

  // Tab untuk melihat buku
  readBooksTab.addEventListener("click", function () {
    allBooksTab.classList.remove("active");
    readBooksTab.classList.add("active");
    unreadBooksTab.classList.remove("active");
    displayBooks(getBooksFromStorage().filter((book) => book.isComplete));
  });

  // Tab untuk melihat buku
  unreadBooksTab.addEventListener("click", function () {
    allBooksTab.classList.remove("active");
    readBooksTab.classList.remove("active");
    unreadBooksTab.classList.add("active");
    displayBooks(getBooksFromStorage().filter((book) => !book.isComplete));
  });

  // Tab untuk mencari buku
  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.trim().toLowerCase();
    const filteredBooks = getBooksFromStorage().filter((book) =>
      book.title.toLowerCase().includes(searchValue)
    );
    displayBooks(filteredBooks);
  });

  allBooksTab.click();
});
