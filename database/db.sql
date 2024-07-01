CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'teacher', 'animator', 'organizer')) NOT NULL
);

CREATE TABLE kids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    age INTEGER NOT NULL,
    group_id INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    term TEXT NOT NULL,
    program TEXT NOT NULL,
    birth_date DATE NOT NULL,
    years_of_learning INTEGER,
    test_result INTEGER
);

CREATE TABLE trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    group_id INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kid_id INTEGER,
    sunday_dinner TEXT,
    monday_lunch TEXT,
    monday_dinner TEXT,
    tuesday_lunch TEXT,
    tuesday_dinner TEXT,
    wednesday_lunch TEXT,
    wednesday_dinner TEXT,
    thursday_lunch TEXT,
    thursday_dinner TEXT,
    friday_lunch TEXT,
    friday_dinner TEXT,
    FOREIGN KEY (kid_id) REFERENCES kids(id)
);

