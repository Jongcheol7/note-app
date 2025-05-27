import sql from "better-sqlite3";

export const db = new sql("note.db");

function initDb() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS USERS(
            id TEXT PRIMARY KEY,
            password TEXT, 
            name TEXT,
            email TEXT,
            picture TEXT NULL,
            nick_name TEXT
        )    
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS SESSIONS(
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            expires_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES USERS(id)
        )    
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS KEYS (
            id TEXT PRIMARY KEY,            -- 로그인 방식 식별자 (예: 'google:123456789', 'email:abc@example.com')
            user_id TEXT NOT NULL,          -- 연결된 유저의 ID (USERS.id 참조)
            hashed_password TEXT,           -- 비밀번호 로그인 방식인 경우에만 사용됨. OAuth인 경우는 NULL
            FOREIGN KEY (user_id) REFERENCES USERS(id)
        );
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS CATEGORY(
            category_no INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            user_id TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            input_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )    
    `);
  db.exec(`
        CREATE TABLE IF NOT EXISTS NOTE(
            note_no INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            title TEXT,
            content TEXT,
            thumnail TEXT,
            category_no INTEGER,
            sort_order INTEGER DEFAULT 0,
            input_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            mod_datetime DATETIME,
            del_datetime DATETIME,
            FOREIGN KEY(user_id) REFERENCES USERS(id),
            FOREIGN KEY(category_no) REFERENCES CATEGORY(category_no)
        )    
    `);
}

initDb();

// 유저 조회
export async function findUserById(userId) {
  return db.prepare("SELECT * FROM USERS WHERE id = ?").get(userId);
}
// 유저 삽입
export async function insertUser(user) {
  return db
    .prepare("INSERT INTO USERS(id, email, name, picture) VALUES(?, ?, ?, ?)")
    .run(user.id, user.email, user.name, user.picture);
}

// 카테고리 조회(사용자별)
export async function selectCategoryByUser(userId) {
  return db
    .prepare(
      `
    SELECT category_no, name, user_id 
    FROM CATEGORY 
    WHERE user_id = ? 
    ORDER BY sort_order`
    )
    .get(userId);
}
// 카테고리 삽입
export async function insertCategory(category) {
  return db
    .prepare(
      `INSERT INTO CATEGORY(name, user_id, sort_order)
    VALUES(?, ?, ?)`
    )
    .run(category.name, category.user_id, category.sort_order);
}

// 메모 조회
export async function selectNoteLists(userId) {
  return db
    .prepare(
      `
    SELECT note_no, user_id, title,
           thumnail, category_no, sort_order 
    FROM NOTE 
    WHERE user_id = ?
    AND del_datetime IS NULL 
    ORDER BY sort_order`
    )
    .all(userId);
}
// 메모 삽입
export async function insertNote({
  user_id,
  title = "",
  content = "",
  thumnail = null,
  category_no = null,
  sort_order = 0,
}) {
  const result = db
    .prepare(
      `
      INSERT INTO NOTE(user_id, title, content, thumnail, category_no, sort_order) 
      VALUES (?, ?, ?, ?, ?, ?)
    `
    )
    .run(user_id, title, content, thumnail, category_no, sort_order);

  return { success: true, noteId: result.lastInsertRowid };
}
