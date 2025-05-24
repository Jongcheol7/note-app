import sql from "better-sqlite3";

export const db = new sql("note.db");

function initDb() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS USERS(
            user_id TEXT PRIMARY KEY,
            password TEXT, 
            name TEXT,
            email TEXT,
            nick_name TEXT
        )    
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS SESSIONS(
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            expires_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES USERS(user_id)
        )    
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS KEYS (
            id TEXT PRIMARY KEY,            -- 로그인 방식 식별자 (예: 'google:123456789', 'email:abc@example.com')
            user_id TEXT NOT NULL,          -- 연결된 유저의 ID (USERS.user_id를 참조)
            hashed_password TEXT,           -- 비밀번호 로그인 방식인 경우에만 사용됨. OAuth인 경우는 NULL
            FOREIGN KEY (user_id) REFERENCES USERS(user_id)
        );
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS CATEGORY(
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            parent_id INTEGER
        )    
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS NOTE(
            note_no INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            title TEXT,
            thumnail TEXT,
            category_id INTEGER,
            input_datetime DATETIME NOT NULL,
            mod_datetime DATETIME,
            del_datetime DATETIME,
            FOREIGN KEY(user_id) REFERENCES USERS(user_id),
            FOREIGN KEY(category_id) REFERENCES CATEGORY(category_id)
        )    
    `);
}

initDb();
