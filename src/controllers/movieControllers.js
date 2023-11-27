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

const database = require("../../database")

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
  database
    .query("select * from movies")
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
      if(movies[0] != null) {
        res.json(movies[0])
        console.log(movies)
      } else {
        res.sendStatus(404)
      }
    })
    .catch((err) => {
      console.error(err)
      res.sendStatus(500)
    })
};

module.exports = {
  getMovies,
  getMovieById,
};
