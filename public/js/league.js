$(document).ready(function() {
    // Getting jQuery references to the tournament name, rules, date, league, form select
    var nameInput = $("#name-input");
    var descriptionInput = $("#description-input");
    
    var leagueForm = $("#league");
    
    // Adding an event listener for when the form is submitted
    $(leagueForm).on("submit", handleFormSubmit);
    // Gets the part of the url that comes after the "?" (which we have if we're updating a league)
    var url = window.location.search;
    
    var leagueId;
    // Sets a flag for whether or not we're updating a league to be false initially
    var updating = false;
  
    // If we have this section in our url, we pull out the league id from the url
    // In '?league_id=1', leagueId is 1
    if (url.indexOf("?leagueid=") !== -1) {
      leagueId = url.split("=")[1];
      getLeagueData(leagueId, "league");
    }
    // Otherwise if we have an league_id in our url, preset the league select box to be our League
    else if (url.indexOf("?leagueid=") !== -1) {
      leagueId = url.split("=")[1];
    }
  
    // Getting the leagues, and their leagues
    getLeagues();
  
    // A function for handling what happens when the form to create a new tournament is submitted
    function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the tournament if we are missing a tournamentname, tournamentrules, or league
      if (!tournamentrulesInput.val().trim() || !tournamentnameInput.val().trim() || !tournamentdateInput.val() || !leagueSelect.val()) {
        return;
      }
      // Constructing a newTournament object to hand to the database
      var newTournament = {
        tournamentrules: tournamentrulesInput
          .val()
          .trim(),

        tournamentdate: tournamentdateInput
        .val(),
        
        buyin: buyinInput
          .val()
          .trim(),
        
          buyinstakes: buyinstakesInput
          .val()
          .trim(),

          rebuy: rebuyInput
          .val()
          .trim(),
        
          rebuystakes: rebuystakesInput
          .val()
          .trim(),
          
          addon: addonInput
          .val()
          .trim(),
        
          addonstakes: addonstakesInput
          .val()
          .trim(),
          
        tournamentname: tournamentnameInput
          .val()
          .trim(),
        LeagueId: leagueSelect.val()
      };
  
      // If we're updating a tournament run updateTournament to update a tournament
      // Otherwise run submitTournament to create a whole new tournament
      if (updating) {
        newTournament.id = tournamentId;
        updateTournament(newTournament);
      }
      else {
        submitTournament(newTournament);
      }
    }
  
    // Submits a new tournament and brings league to blog page upon completion
    function submitTournament(tournament) {
      $.post("/api/leagues", tournament, function() {
        window.location.href = "/tours";
      });
    }
  
    // Gets tournament data for the current tournament if we're editing, or if we're adding to an league's existing leagues
    function getLeagueData(id, type) {
      var queryUrl;
      switch (type) {
      case "tournament":
        queryUrl = "/api/leagues/" + id;
        break;
      case "league":
        queryUrl = "/api/leagues/" + id;
        break;
      default:
        return;
      }
      $.get(queryUrl, function(data) {
        if (data) {
          console.log(data.LeagueId || data.id);
          // If this tournament exists, prefill our tournament forms with its data
          tournamentrulesInput.val(data.tournamentrules);
          tournamentnameInput.val(data.tournamentname);
          tournamentdateInput.val(data.tournamentdate);

          //finish form
          leagueId = data.LeagueId || data.id;
          // If we have a tournament with this id, set a flag for us to know to update the tournament
          // when we hit submit
          updating = true;
        }
      });
    }
  
    // A function to get Leagues and then render our list of Leagues
    function getLeagues() {
      $.get("/api/leagues", renderLeagueList);
    }
    // Function to either render a list of leagues, or if there are none, direct the league to the page
    // to create an league first
    function renderLeagueList(data) {
      if (!data.length) {
        window.location.href = "/leagues";
      }
      $(".hidden").removeClass("hidden");
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createLeagueRow(data[i]));
      }
      leagueSelect.empty();
      console.log(rowsToAdd);
      console.log(leagueSelect);
      leagueSelect.append(rowsToAdd);
      leagueSelect.val(leagueId);
    }
  
    // Creates the league options in the dropdown
    function createLeagueRow(league) {
      var listOption = $("<option>");
      console.log(league);
      console.log(league.name);
      listOption.attr("value", league.id);
      listOption.text(league.name);
      return listOption;
    }
  
    // Update a given tournament, bring league to the blog page when done
    function updateTournament(tournament) {
      $.ajax({
        method: "PUT",
        url: "/api/leagues",
        data: tournament
      })
        .then(function() {
          window.location.href = "/tournament";
        });
    }
  });
  