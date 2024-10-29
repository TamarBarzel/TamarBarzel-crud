import React from "react";
import { useEffect, useState } from "react";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    if (selectedBook) {
      try {
        const response = await fetch(
          `http://localhost:5000/books/${selectedBook.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author }),
          }
        );
        if (!response.ok) {
          throw new Error("failed");
        }
        const updateBook = await response.json();
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === updateBook.id ? updateBook : book
          )
        );
      } catch (error) {
        console.error("failed", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:5000/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author }),
        });
        if (!response.ok) {
          throw new Error("failed add book");
        }
        const newBook = await response.json();
        setBooks((prevBooks) => [...prevBooks, newBook]);
      } catch (error) {
        console.error("failed add book", error);
      }
    }
    setSelectedBook(null);
    setAuthor("");
    setTitle("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("failed to delete");
      }
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("failed delete book", error);
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setAuthor(book.author);
    setTitle(book.title);
  };

  const handleCancle = () => {
    setSelectedBook(null);
    setAuthor("");
    setTitle("");
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/books");
        if (!response.ok) {
          throw new Error("failed to fetch data");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("error in fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h2> Books List</h2>
      {loading ? (
        <p> Loading books, please wait</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong>by {book.author} index{book.id}
              <button onClick={() => handleEdit(book)}>edit book</button>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>{selectedBook ? "edit book" : "add new book"}</h3>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button onClick={handleSave}>{selectedBook ? "update" : "add"}</button>
        <button onClick={handleCancle}>cancle</button>
      </div>
    </div>
  );
};

export default Books;
