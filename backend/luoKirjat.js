const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("kirjat.db");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS kirja");

  db.run(`
    CREATE TABLE kirja (
      id INTEGER PRIMARY KEY,
      nimi TEXT,
      kirjailija TEXT,
      kuvaus TEXT,
      lukuajankohta Date,
      kuva TEXT,
      laji TEXT,
      arvosana INTEGER
    )
  `);

  const stmt = db.prepare(`
    INSERT INTO kirja (id, nimi, kirjailija, kuvaus, lukuajankohta, kuva, laji, arvosana)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.finalize();

  console.log("Tietokanta luotu ja tiedot lisätty!");
});

db.close();
