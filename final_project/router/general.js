const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Get author name from request parameters
    const keys = Object.keys(books); // Get all ISBN keys
    const booksByAuthor = []; // To store matching books
  
    // Loop through all books and find matches by author
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor.push({ isbn: key, ...books[key] });
      }
    });
  
    // If any books are found, return them
    if (booksByAuthor.length > 0) {
      res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      res.status(404).json({ message: `No books found for author: ${author}` });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
