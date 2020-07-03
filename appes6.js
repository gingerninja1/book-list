// Book constructor
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI constructor
class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.isbn}</td><td><a href="" class="delete">X</a></td>`;
        list.appendChild(row);
    }
    
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }
    
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
    
    showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(function() {
            document.querySelector('.alert').remove()
        }, 3000);
    }
}

// Local Storage class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    
    static displayBooks() {
        const books = Store.getBooks();
        
        books.forEach(function(book) {
            const ui = new UI();

            ui.addBookToList(book);
        })
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        //console.log(isbn);
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event listener for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);

    const ui = new UI();

    // Validate
    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to list
        ui.addBookToList(book);
        Store.addBook(book);
        ui.showAlert('Book has been added', 'success');
        ui.clearFields();
    }
})

// Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e) {
    e.preventDefault();
    const ui = new UI();

    ui.deleteBook(e.target);

    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    ui.showAlert('Book has been removed', 'success');
})

document.addEventListener('DOMContentLoaded', Store.displayBooks);