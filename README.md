# Book Diary Application

## Project Description

This is a full-stack web application with a frontend-focused single page application (SPA) and a lightweight backend.

It demonstrates the use of React, REST APIs and SQLite in a book diary application.

This application helps users keep track of books they have read.
Users can add, edit and delete books, as well as monitor their progress toward a reading goal.

The front page highlights the three highest-rated books.

### Front page

![Front page](/images/bookdiary_frontpage.png)

### Add Book form

![Add book form](/images/book_form.png)

### Search and List Books

![Search and list](/images/search_list.png)

### Charts page

![Charts](/images/charts.png)

## API Endpoints

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| GET    | /kirja/all        | Get all books     |
| GET    | /kirja/one/:id    | Get a single book |
| POST   | /kirja/add        | Add a new book    |
| PUT    | /kirja/edit/:id   | Edit a book       |
| DELETE | /kirja/delete/:id | Delete a book     |

## Key Features

- React-based single page application
- Full CRUD functionality for books
- REST API backend built with Express
- SQLite database for persistent storage
- Image upload support for book images

## Installation & Running

### Backend

```bash
cd backend
npm install
node kirjaServer.cjs
```

the backend runs on:

http://localhost:8080

### Frontend

```bash
cd frontend
npm install
npm run dev
```

the frontend runs on:

http://localhost:5173

## Technologies Used

### Frontend

- JavaScript
- React
- React Router
- Vite
- Material UI

### Backend

- Node.js
- Express
- SQLite
- Multer

## Notes

- The application demonstrates end-to-end data flow: from frontend form submission through a REST API to SQLite database, including handling file uploads with Multer
- Uploaded images are stored locally on the backend server, and only image filename is saved in the database
- This project was created as part of a frontend development course
