const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// register route
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered." });
  });
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    // Use JSON.stringify for neat output
    res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error("Error fetching book list:", error);
    res.status(500).json({ message: "Failed to retrieve books" });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  
    // Check if the book with that ISBN exists in the books object
    const book = books[isbn];
  
    if (book) {
      // Return the book details neatly
      res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      // If not found, return an error message
      res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  });
  
  
  public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // get author from request
    let matchingBooks = [];
  
    // get all book keys
    const bookKeys = Object.keys(books);
  
    // iterate through all books
    bookKeys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });
  
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  });
  
  

  public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get the title from the URL parameter
    let matchingBooks = [];
  
    // Loop through all books to find a match
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });
  
    // Return the result
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  });
  

  public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Check if the book exists
    if (books[isbn]) {
      const reviews = books[isbn].reviews;
  
      // Check if there are any reviews
      if (Object.keys(reviews).length > 0) {
        res.status(200).json(reviews);
      } else {
        res.status(200).json({ message: "No reviews available for this book" });
      }
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
