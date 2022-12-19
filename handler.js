const bookshelf = require("./bookshelf");
const { nanoid } = require("nanoid");

const getBooks = (request, h) => {
    let data = bookshelf;

    if (request.query.reading == 0 || request.query.reading == 1) {
        data = data.filter(v => v.reading == request.query.reading);
    }

    if (request.query.finished == 0 || request.query.finished == 1) {
        data = data.filter(v => v.finished == request.query.finished);
    }

    if (request.query.name) {
        data = data.filter(v => v.name.toLowerCase().includes("dicoding"));
    }

    data = data.map(v => {
        return {
            id: v.id,
            name: v.name,
            publisher: v.publisher
        };
    });

    return h.response({
        status: "success",
        data: {
            books: data
        }
    }).code(200);
}

const addBook = (request, h) => {
    const data = request.payload;
    let { reading } = data;
    delete data.reading;

    if (!data.hasOwnProperty("name")) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        }).code(400);
    };

    if (data.readPage > data.pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);
    };

    const newBookshelf = {
        id: nanoid(16),
        ...data,
        finished: data.pageCount == data.readPage,
        reading,
        insertedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    bookshelf.push(newBookshelf);

    if (bookshelf.filter(book => book.id == newBookshelf.id).length > 0) {
        return h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                "bookId": newBookshelf.id
            }
        }).code(201);
    };

    return h.response({
        status: "error",
        message: "Buku gagal ditambahkan"
    }).code(500);
}

const getBookById = (request, h) => {
    if (bookshelf.findIndex(v => v.id == request.params.bookId) == -1) {
        return h.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        }).code(404);
    };

    return h.response({
        status: "success",
        data: {
            book: bookshelf.find(v => v.id == request.params.bookId)
        }
    }).code(200);
}

const updateBookById = (request, h) => {
    let data = request.payload;
    let { reading } = data;
    delete data.reading;
    delete data.finished;
    delete data.updatedAt;

    const book = bookshelf.find(v => v.id == request.params.bookId);
    
    let indexBook = bookshelf.findIndex(v => v.id == request.params.bookId);

    if (!book || indexBook == -1) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404);
    };

    if (!data.hasOwnProperty("name")) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        }).code(400);
    };

    if (data.readPage > data.pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);
    };

    const updateBook = {
        ...book,
        ...data,
        finished: data.pageCount == data.readPage,
        reading,
        insertedAt: book.insertedAt,
        updatedAt: book.insertedAt
    };

    if (bookshelf.splice(indexBook, 1, updateBook)) {
        return h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
            data: {
                "bookId": updateBook
            }
        }).code(200);
    };
}

const deleteBookById = (request, h) => {
    const book = bookshelf.find(v => v.id == request.params.bookId);
    
    let indexBook = bookshelf.findIndex(v => v.id == request.params.bookId);
    
    if (!book || indexBook == -1) {
        return h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        }).code(404);
    };

    if (bookshelf.splice(indexBook, 1)) {
        return h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        });
    };
}

module.exports = { getBooks, addBook, getBookById, updateBookById, deleteBookById }