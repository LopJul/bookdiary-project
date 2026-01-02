const express = require("express");
const app = express();

let helmet = require("helmet");
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(express.urlencoded({ limit: "5mb", extended: true }));

const cors = require("cors");
app.use(cors());

app.use(express.json());

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("kirjat.db", (error) => {
  if (error) {
    console.log(error.message);
    return { message: "Kantaa ei voida avata " + error.message };
  }
});

app.listen(8080, () => {
  console.log("Node toimii localhost:8080");
});

//---------

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Toimii" });
});

app.get("/kirja/all", (req, res) => {
  db.all("select * from kirja", (error, result) => {
    if (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.log(result);
    return res.status(200).json(result);
  });
});

app.get("/kirja/one/:id", (req, res) => {
  let id = req.params.id;

  db.get("select * from kirja where id = ?", [id], (error, result) => {
    if (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }

    if (typeof result == "undefined") {
      return res.status(404).json({ message: "Haettua kirjaa ei ole" });
    }

    return res.status(200).json(result);
  });
});

app.get("/kirja/kuvat", (req, res) => {
  db.all("select kuva from kirja where kuva IS NOT NULL", (error, result) => {
    if (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json(result);
  });
});

app.delete("/kirja/delete/:id", (req, res) => {
  let id = req.params.id;

  db.run("delete from kirja where id = ?", [id], function (error) {
    if (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }

    if (this.changes === 0) {
      console.log("Ei poistettavaa");
      return res.status(404).json({ message: "Ei poistettavaa kirjaa" });
    }

    return res.status(200).json({ count: this.changes });
  });
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./images");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/kirja/add", upload.single("kuva"), (req, res) => {
  let kirja = req.body;

  let kuvaNimi = null;
  if (req.file) {
    kuvaNimi = req.file.originalname;
  }

  db.run(
    "insert into kirja (nimi, kirjailija, kuvaus, lukuajankohta, laji, arvosana, kuva) values (?, ?, ?, ?, ?, ?, ?)",
    [
      kirja.nimi,
      kirja.kirjailija,
      kirja.kuvaus,
      kirja.lukuajankohta,
      kirja.laji,
      kirja.arvosana,
      kuvaNimi,
    ],
    (error) => {
      if (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
      }

      return res.status(200).json({ count: 1 });
    }
  );
});

app.put("/kirja/edit/:id", upload.single("kuva"), (req, res) => {
  const id = Number(req.params.id);
  const kirja = req.body;

  console.log("id: ", id);
  console.log("kirja: ", kirja);

  let kuvaNimi = undefined;
  if (req.file) {
    kuvaNimi = req.file.originalname;
  }

  db.get("select * from kirja where id = ?", [id], (error, vanhaKirja) => {
    if (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }

    if (!vanhaKirja) {
      return res.status(404).json({ message: "Kirjaa ei löytynyt" });
    }

    const ladattavaKuva = kuvaNimi || vanhaKirja.kuva;

    db.run(
      `update kirja
       set nimi = ?, kirjailija = ?, kuvaus = ?, lukuajankohta = ?, laji = ?, arvosana = ?, kuva = ?
       where id = ?`,
      [
        kirja.nimi,
        kirja.kirjailija,
        kirja.kuvaus,
        kirja.lukuajankohta,
        kirja.laji,
        kirja.arvosana,
        ladattavaKuva,
        id,
      ],
      (error) => {
        if (error) {
          console.log(error.message);
          return res.status(400).json({ message: error.message });
        }

        return res.status(200).json({ count: 1 });
      }
    );
  });
});

app.use("/images", express.static("images"));
app.get("/download/:nimi", (req, res) => {
  let file = "./images/" + req.params.nimi;
  res.download(file);
});

app.get("/*splat", (req, res) => {
  return res.status(404).json({ message: "Ei pyydettyä palvelua" });
});
