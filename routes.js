const { getBooks, addBook, getBookById, updateBookById, deleteBookById } = require("./handler.js");

const routes = [
    {
        method: "GET",
        path: "/books",
        handler: getBooks
    },
    {
        method: "POST",
        path: "/books",
        handler: addBook
    },
    {
        method: "GET",
        path: "/books/{bookId}",
        handler: getBookById
    },
    {
        method: "PUT",
        path: "/books/{bookId}",
        handler: updateBookById
    },
    {
        method: "DELETE",
        path: "/books/{bookId}",
        handler: deleteBookById
    }
]

module.exports = routes;