const DB = require('../utils/db.js')

module.exports = {
  /**
   * 所有电影
   */
  movieList: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies")
  },
  //flag
  /**
   * 单个电影
   */
  movieDetail: async ctx => {
    movieID = +ctx.params.id
    ctx.state.data = await DB.query('SELECT * FROM movies WHERE movies.id=?', [movieID])
  }
}

// recommendation: async ctx => {
//   const mArray = await DB.query("SELECT * FROM movie_review")
//   const radomMovie = mArray[Math.round(Math.random() * (mArray.length - 1))]
//   const movie_id = radomMovie.data.data.movie_id
//   ctx.state.data = await DB.query("SELECT * FROM movies WHERE movies.movie_id = ?", [movie_id])
//   // ctx.state.data =  
// }
// }