// ---------- Constructor ----------
function Book(id, title, author, status) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.status = status;
}



// ----------  Arrays with actual information ----------
var availableBooks = [
  new Book("1112", "1984", "George Orwell", "Available"),
  new Book("1125", "Clean Code", "Robert Martin", "Available"),
  new Book("1144", "Data Structures", "Mark Allen", "Available"),
  new Book("1151", "Don Quixote", "Miguel de Cervantes", "Available"),
  new Book("1162", "Emma", "Jane Austen", "Available"),
  new Book("1177", "Fahrenheit 451", "Ray Bradbury", "Available"),
  new Book("1183", "Frankenstein", "Mary Shelley", "Available"),
  new Book("1201", "Great Expectations", "Charles Dickens", "Available"),
  new Book("1214", "Hamlet", "William Shakespeare", "Available"),
  new Book("1222", "Heart of Darkness", "Joseph Conrad", "Available"),
  new Book("1238", "It", "Stephen King", "Available"),
  new Book("1247", "Jurassic Park", "Michael Crichton", "Available"),
  new Book("1255", "Lord of the Flies", "William Golding", "Available"),
  new Book("1260", "Metro 2033", "Dmitry Glukhovsky", "Available"),
  new Book("1273", "Moby-Dick", "Herman Melville", "Available"),
  new Book("1288", "Nineteen Eighty-Four", "George Orwell", "Available"),
  new Book("1299", "Oliver Twist", "Charles Dickens", "Available"),
  new Book("1304", "Quantum Thief", "Hannu Rajaniemi", "Available"),
  new Book("1310", "Slaughterhouse-Five", "Kurt Vonnegut", "Available"),
  new Book("1326", "The Road", "Cormac McCarthy", "Available"),
  new Book("1339", "Ulysses", "James Joyce", "Available"),
  new Book("1342", "Vicious", "V. E. Schwab", "Available"),
  new Book("1351", "Watership Down", "Richard Adams", "Available")
];

var borrowedBooks = [
  new Book("2104", "All the Light We Cannot See", "Anthony Doerr", "Borrowed"),
  new Book("2111", "And Then There Were None", "Agatha Christie", "Borrowed"),
  new Book("2122", "Brave New World", "Aldous Huxley", "Borrowed"),
  new Book("2130", "Crime and Punishment", "Fyodor Dostoevsky", "Borrowed"),
  new Book("2146", "Eleanor Oliphant Is Completely Fine", "Gail Honeyman", "Borrowed"),
  new Book("2163", "Invisible Man", "Ralph Ellison", "Borrowed"),
  new Book("2179", "Jane Eyre", "Charlotte Brontë", "Borrowed"),
  new Book("2188", "Kafka on the Shore", "Haruki Murakami", "Borrowed"),
  new Book("2195", "Mrs. Dalloway", "Virginia Woolf", "Borrowed"),
  new Book("2202", "Quiet: The Power of Introverts...", "Susan Cain", "Borrowed"),
  new Book("2217", "Rebecca", "Daphne du Maurier", "Borrowed"),
  new Book("2231", "The Trail", "Franz Kafka", "Borrowed"),
  new Book("2240", "Uncle Tom's Cabin", "Harriet Beecher Stowe", "Borrowed"),
  new Book("2252", "Wuthering Heights", "Emily Brontë", "Borrowed"),
  new Book("2266", "Young Goodman Brown and Other Stories", "Nathaniel Hawthorne", "Borrowed"),
  new Book("2277", "Zen and the Art of Motorcycle Maintenance", "Robert M. Pirsig", "Borrowed"),
  new Book("2290", "Zorba the Greek", "Nikos Kazantzakis", "Borrowed")
];


// ---------- TWO functions to display arrays into tables ----------
function renderTable(array, tbodyId, badgeClass) {
  var tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = "";

  for (var i = 0; i < array.length; i++) {
    var book = array[i];

    var tr = document.createElement("tr");

    tr.innerHTML =
      "<td>" + book.id + "</td>" +
      "<td>" + book.title + "</td>" +
      "<td>" + book.author + "</td>" +
      "<td><span class='badge " + badgeClass + "'>" + book.status + "</span></td>";

    tbody.appendChild(tr);
  }
}

function renderAvailableBooks() {
  renderTable(availableBooks, "availableBooksBody", "bg-success");
}

function renderBorrowedBooks() {
  renderTable(borrowedBooks, "borrowedBooksBody", "bg-warning");
}


// ---------- Add & search functions used by the FORMS ----------
function addBorrowedBook(id, title, author) {
  borrowedBooks.push(new Book(id, title, author, "Borrowed"));
  renderBorrowedBooks();
}

// search in both arrays by title (simple search)
function searchByTitle(title) {
  var t = title.toLowerCase();
  var results = [];

  var i;
  for (i = 0; i < availableBooks.length; i++) {
    if (availableBooks[i].title.toLowerCase().indexOf(t) !== -1) {
      results.push("Available: " + availableBooks[i].title + " (ID " + availableBooks[i].id + ")");
    }
  }
  for (i = 0; i < borrowedBooks.length; i++) {
    if (borrowedBooks[i].title.toLowerCase().indexOf(t) !== -1) {
      results.push("Borrowed: " + borrowedBooks[i].title + " (ID " + borrowedBooks[i].id + ")");
    }
  }
  return results;
}


// ---------- Hook tables + forms when page is loaded ----------
window.addEventListener("DOMContentLoaded", function () {
  // Show tables (only exists in tables.html)
  renderAvailableBooks();
  renderBorrowedBooks();

  // --- Search form (forms.html) ---
  var searchForm = document.getElementById("searchBookForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var titleInput = document.getElementById("title");
      var resultBox = document.getElementById("searchResult");
      var results = searchByTitle(titleInput.value);

      if (results.length === 0) {
        resultBox.textContent = "No book found.";
      } else {
        resultBox.innerHTML = results.join("<br>");
      }
    });
  }

  // --- Borrow form (forms.html) ---
  var borrowForm = document.getElementById("borrowBookForm");
  if (borrowForm) {
    borrowForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var bookId = document.getElementById("bookId").value;
      var studentId = document.getElementById("studentId").value;

      // move book from availableBooks to borrowedBooks
      var foundIndex = -1;
      var i;
      for (i = 0; i < availableBooks.length; i++) {
        if (availableBooks[i].id === bookId) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        alert("Book ID not found in Available Books table.");
        return;
      }

      var book = availableBooks[foundIndex];
      availableBooks.splice(foundIndex, 1);        // remove from available
      borrowedBooks.push(new Book(book.id, book.title, book.author, "Borrowed"));

      renderAvailableBooks();
      renderBorrowedBooks();

      alert("Book " + book.title + " borrowed by student " + studentId);
      borrowForm.reset();
    });
  }
});
