const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(express.json());
app.use(cors());

let books = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
];
let currentId = books.length + 1;

app.get("/books", (req, res) => {
  res.status(201).json(books);
});

app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);
  if (bookId) {
    res.status(201).json(book);
  } else {
    res.status(404).json({ massage: "book not found" });
  }
});

app.post("/books", (req, res) => {
  const newBook = {
    id: currentId,
    title: req.body.title,
    author: req.body.author,
  };
  books.push(newBook);
  currentId++;
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (book) {
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    res.status(201).json(book);
  } else {
    res.status(404).json({ message: "book not found" });
  }
});

app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id ===bookId);

  if (book) {
    books = books.filter((b) => b.id !== bookId);
    res.status(201).json({ message: "book deleted succesfully" });
  } else {
    res.status(404).json({ message: "book not found" });
  }
});

app.listen(PORT, () => {
  console.log(`server is listening at http://${PORT}`);
});
