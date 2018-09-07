// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the tournaments
  app.get("/api/tournaments", function (req, res) {
    var query = {};
    console.log("api/tournaments");
    if (req.query.leagueid) {
      query.LeagueId = req.query.leagueid;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.League
    db.Tournament.findAll({
      where: query,
      include: [db.League]
    }).then(function (dbTournament) {
      /*console.log("dbTournament");
      console.log(dbTournament.tournamentdate);
      
      var data = new Date(dbTournament.tournamentdate);
            dbTournament.tournamentdateformat = data.getFullYear() +
      '-' +
      (data.getMonth() < 9 ? '0' : '') +
      (data.getMonth() + 1) + '-' +
      data.getDate();
      //return dateformat;
      console.log(data);
      console.log(dbTournament.tournamentdateformat); 
*/
      res.json(dbTournament);
    });
  });







  // Get route for retrieving a single tournament
  app.get("/api/tournaments/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.League
    db.Tournament.findOne({
      where: {
        id: req.params.id
      },
      include: [db.League]
    }).then(function (dbTournament) {
      res.json(dbTournament);
    });
  });

  // POST route for saving a new tournament
  app.post("/api/tournaments", function (req, res) {
    db.Tournament.create(req.body).then(function (dbTournament) {
      res.json(dbTournament);
    });
  });

  // DELETE route for deleting tournaments
  app.delete("/api/tournaments/:id", function (req, res) {
    db.Tournament.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbTournament) {
      res.json(dbTournament);
    });
  });

  // PUT route for updating tournaments
  app.put("/api/tournaments", function (req, res) {
    db.Tournament.update(
      req.body, {
        where: {
          id: req.body.id
        }
      }).then(function (dbTournament) {
      res.json(dbTournament);
    });
  });
};