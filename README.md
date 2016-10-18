# Cmail

Cmail is a Gmail clone implementing 'inbox,' 'sent mail,' and 'compose mail' functionality.  Cmail also implements starred and unread emails and permits sending, receiving, and deleting emails, which are connected to accounts through a postgres database.

### Installation and Quick Start

Before installing this project, you must create a postgres database called Cmail.

Clone the repo, install dependencies, and run the seed file.

```bash
$ cd Cmail
$ npm install
$ node seed.js
```

When the database has finished seeding, you can start the server, which is listening on port 3000.

```bash
$ npm start
```