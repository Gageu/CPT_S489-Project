-- database structure

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT,
  status TEXT
);

DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  owner TEXT NOT NULL,
  owner_email TEXT,
  privacy TEXT
);

DROP TABLE IF EXISTS group_members;
CREATE TABLE group_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER,
  user_email TEXT
);

DROP TABLE IF EXISTS invites;
CREATE TABLE invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER,
  email TEXT,
  status TEXT
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER,
  title TEXT,
  date TEXT
);

DROP TABLE IF EXISTS rsvps;
CREATE TABLE rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER,
  user_email TEXT
);

DROP TABLE IF EXISTS resources;
CREATE TABLE resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  uploaded_by TEXT,
  group_id INTEGER
);
