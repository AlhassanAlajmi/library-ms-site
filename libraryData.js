// ================================
// 1. Constructors (two object types)
// ================================
function Book(id, title, author, status) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.status = status; // "Available" or "Borrowed"
}

function BorrowRecord(bookId, studentId, borrowDate) {
  this.bookId = bookId;
  this.studentId = studentId;
  this.borrowDate = borrowDate;
}

// ================================
// 2. Arrays (will be filled by loadData)
// ================================
var availableBooks = [];
var borrowedBooks = [];
var borrowRecords = [];

// Default data for first run
function initDefaultData() {
  availableBooks = [
    new Book("1112", "1984", "George Orwell", "Available"),
    new Book("1125", "Clean Code", "Robert Martin", "Available"),
    new Book("1144", "Data Structures", "Mark Allen Weiss", "Available"),
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

  borrowedBooks = [
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

  // start with no recorded borrow history
  borrowRecords = [];
}

// --------------------------
// Save / Load using localStorage
// --------------------------
function saveData() {
  var data = {
    availableBooks: availableBooks,
    borrowedBooks: borrowedBooks,
    borrowRecords: borrowRecords
  };
  localStorage.setItem("libraryData", JSON.stringify(data));
}

function loadData() {
  var stored = localStorage.getItem("libraryData");
  if (stored) {
    var data = JSON.parse(stored);

    availableBooks = (data.availableBooks || []).map(function (b) {
      return new Book(b.id, b.title, b.author, b.status);
    });

    borrowedBooks = (data.borrowedBooks || []).map(function (b) {
      return new Book(b.id, b.title, b.author, b.status);
    });

    borrowRecords = (data.borrowRecords || []).map(function (r) {
      return new BorrowRecord(r.bookId, r.studentId, r.borrowDate);
    });
  } else {
    initDefaultData();
    saveData();
  }
}

// ========================================
// 3. Functions to display arrays in tables
// ========================================
function renderTable(array, tbodyId, badgeClass) {
  var tbody = document.getElementById(tbodyId);
  if (!tbody) return;   // page might not have that table

  tbody.innerHTML = ""; // clear

  array.forEach(function (book) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + book.id + "</td>" +
      "<td>" + book.title + "</td>" +
      "<td>" + book.author + "</td>" +
      "<td><span class='badge " + badgeClass + "'>" + book.status + "</span></td>";
    tbody.appendChild(tr);
  });
}

function renderAvailableBooks() {
  renderTable(availableBooks, "availableBooksBody", "bg-success");
}

function renderBorrowedBooks() {
  renderTable(borrowedBooks, "borrowedBooksBody", "bg-warning");
}

function renderTopBorrowers() {
  var tbody = document.getElementById("topBorrowersBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!borrowRecords.length) {
    tbody.innerHTML =
      "<tr><td colspan='2' class='text-center'>No borrowing records yet.</td></tr>";
    return;
  }

  // Count books per student
  var counts = {};
  borrowRecords.forEach(function (rec) {
    counts[rec.studentId] = (counts[rec.studentId] || 0) + 1;
  });

  // Sort by count desc
  var sorted = Object.keys(counts)
    .map(function (id) {
      return { studentId: id, count: counts[id] };
    })
    .sort(function (a, b) {
      return b.count - a.count;
    });

  // Create rows
  sorted.forEach(function (entry) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + entry.studentId + "</td>" +
      "<td>" + entry.count + "</td>";
    tbody.appendChild(tr);
  });
}

function saveAndRender() {
  saveData();
  renderAvailableBooks();
  renderBorrowedBooks();
  renderTopBorrowers();
}

// =============================================
// 4. Logic to SEARCH and BORROW
// =============================================
function searchByTitle(title) {
  var t = title.toLowerCase();
  var results = [];

  availableBooks.forEach(function (b) {
    if (b.title.toLowerCase().indexOf(t) !== -1) {
      results.push("Available: " + b.title + " (ID: " + b.id + ")");
    }
  });

  borrowedBooks.forEach(function (b) {
    if (b.title.toLowerCase().indexOf(t) !== -1) {
      results.push("Borrowed: " + b.title + " (ID: " + b.id + ")");
    }
  });

  return results;
}

function borrowBookById(bookId, studentId, borrowDate) {
  var index = availableBooks.findIndex(function (b) {
    return b.id === bookId;
  });

  if (index === -1) {
    alert("Book ID not found in Available Books.");
    return;
  }

  // remove from available
  var book = availableBooks.splice(index, 1)[0];

  // mark as borrowed and push to borrowedBooks
  book.status = "Borrowed";
  borrowedBooks.push(book);

  // default date if empty
  var dateStr = borrowDate;
  if (!dateStr) {
    var d = new Date();
    dateStr = d.toISOString().slice(0, 10); // yyyy-mm-dd
  }

  // record this borrowing (this powers Top Borrowers)
  borrowRecords.push(new BorrowRecord(book.id, studentId, dateStr));

  // persist + update all tables (including Top Borrowers)
  saveAndRender();

  alert('Book "' + book.title + '" borrowed by student ' + studentId + ".");
}

// =========================================
// 5. Attach events when page is loaded
// =========================================
window.addEventListener("DOMContentLoaded", function () {
  // 1) Load data from localStorage or defaults
  loadData();

  // 2) Render tables (if this page has them)
  renderAvailableBooks();
  renderBorrowedBooks();
  renderTopBorrowers();

  // 3) Search form (forms.html)
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

  // 4) Borrow form (forms.html)
  var borrowForm = document.getElementById("borrowBookForm");
  if (borrowForm) {
    borrowForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var bookId = document.getElementById("bookId").value.trim();
      var studentId = document.getElementById("studentId").value.trim();
      var borrowDate = document.getElementById("borrowDate").value;

      if (!bookId || !studentId) {
        alert("Please fill in Book ID and Student ID.");
        return;
      }

      borrowBookById(bookId, studentId, borrowDate);
      borrowForm.reset();
    });
  }
});

