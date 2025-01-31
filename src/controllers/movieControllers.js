const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    color: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    color: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const database = require("../../database");

const getMovies = (req, res) => {
  // database
  //   .query("select * from movies")
  //   .then((result) => {

  // const movies = result[0];
  // console.log(movies);

  // ou en destructuration de tableau :

  //     const [movies] = result
  //     console.log(movies)
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  // ou en destructurant carrement le parametre :
  let sql = "SELECT * FROM movies"
  const sqlValues = []

  if(req.query.color != null) {
    sql += " WHERE color = ?";
    sqlValues.push(req.query.color)

    if(req.query.max_duration !== null) {
      sql += " AND duration <= ?";
      sqlValues.push(req.query.max_duration)
    }
  } else if(req.query.max_duration != null) {
      sql += " WHERE duration <= ?";
      sqlValues.push(req.query.max_duration)
  }

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  // const movie = movies.find((movie) => movie.id === id);
  // if (movie != null) {
  //   res.json(movie);
  // } else {
  //   res.status(404).send("Not Found");
  // }
  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  // res.send("Post route is working")
  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(422);
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "UPDATE movies SET title=?, director=?, year=?, color=?, duration=? WHERE id=?", 
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if(result.affectedRows === 0) {
        res.sendStatus(404)
      } else {
        res.sendStatus(204)
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id)

  database
    .query("DELETE FROM movies WHERE id=?", [id])
    .then(([result]) => {
      if(result.affectedRows === 0) {
        res.sendStatus(404)
      } else {
        res.sendStatus(204)
      }
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie
};
