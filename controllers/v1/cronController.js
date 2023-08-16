import Competition from "../../models/v1/Competition.js";
import Event from "../../models/v1/Event.js";
import Sport from "../../models/v1/Sport.js";
import BetCategory, { DEFAULT_CATEGORIES } from "../../models/v1/BetCategory.js";

//Import Service
import MarketService from "../../services/v1/marketService.js";
import commonService from "../../services/v1/commonService.js";

import { appConfig } from "../../config/app.js";
import Market from "../../models/v1/Market.js";

//Sync all APIs for Sports, Competitions, Events
const syncDetail = async (req, res) => {
  try {
    // Call the syncSports function to sync sports data
    var sportIds = await syncSports();
    console.log("All Sports has been synced");

    // Call the syncCompetition function to sync competition data
    var competitionIds = await syncCompetition(sportIds);
    console.log("All Competitions has been synced");

    // Call the syncEvent function to sync Event data
    var eventApiIds = await syncEvents(competitionIds);
    console.log("All Events has been synced");

    // Call the syncMarket function to sync Market data
    await syncMarket(eventApiIds);

    // Respond with a 200 status code and success message
    res.status(200).json({ message: "All data has been synced!" });
  } catch (e) {
    // Handle any errors that occurred during the sync process
    res.status(500).json({ error: "An error occurred" });
  }
};

// Common Function to Sync Sports
async function syncSports() {
  var sportsIdArray = [];
  // Construct the URL to fetch sports data from the API
  var url = `${appConfig.BASE_URL}?action=sports`;

  // Fetch sports data from the API using the fetchData function
  const { statusCode, data } = await commonService.fetchData(url);
  // Check if the API request was successful (status code 200)
  if (statusCode === 200) {
    // Loop through each sport object in the data array
    for (const sport of data) {
      // Query the database to find if the sport already exists using its apiSportId
      var checkSport = await Sport.findOne({
        apiSportId: Number(sport.eventType),
      });

      // If the sport does not exist in the database, add it
      if (!checkSport) {
        // Create a new sport data object to be saved in the database
        const sportData = {
          name: sport.name,
          apiSportId: Number(sport.eventType),
          marketCount: sport.marketCount,
        };

        // Create a new Sport document with the sportData and save it in the database
        var sportInfo = new Sport(sportData);
        await sportInfo.save();
        sportsIdArray.push({ apiSportId: Number(sport.eventType), sportId: sportInfo._id });
      } else {
        checkSport.marketCount = sport.marketCount;
        checkSport.save();
        sportsIdArray.push({ apiSportId: Number(sport.eventType), sportId: checkSport._id });
      }
    }
  }

  return sportsIdArray;
}

// Function to sync competitions with the database
async function syncCompetition(sportIds) {
  var competitionIds = [];
  // Iterate through each sport to fetch competitions for it
  for (const sport of sportIds) {
    // Construct the URL to fetch competitions data for the current sport
    var competitionUrl = `${appConfig.BASE_URL}?action=serise&sport_id=${sport.apiSportId}`;
    // Fetch competitions data from the API for the current sport
    const { statusCode, data } = await commonService.fetchData(competitionUrl);

    // Check if the API request was successful (status code 200)
    if (statusCode === 200) {
      var competitionObjArray = [];
      // Iterate through each competition data for the current sport
      for (const competition of data) {
        competitionIds.push(competition.competition.id);
        // Prepare the competition object to be saved in the database
        const competitionObj = {
          name: competition.competition.name,
          sportId: sport.sportId,
          apiSportId: sport.apiSportId,
          apiCompetitionId: competition.competition.id,
          marketCount: competition.marketCount,
          competitionRegion: competition.competitionRegion,
        };

        competitionObjArray.push(competitionObj);
      }

      if (competitionObjArray.length > 0) {
        // Bulk upsert operation
        const compOps = competitionObjArray.map((competition) => ({
          updateOne: {
            filter: { apiSportId: competition.apiSportId, apiCompetitionId: competition.apiCompetitionId },
            update: competition,
            upsert: true,
          },
        }));

        await Competition.bulkWrite(compOps);
      }
    }
  }

  return competitionIds;
}

// Function to sync events with the database
async function syncEvents(competitionIds) {
  var evenyApiIds = [];

  //Get all competition information
  var allCompetitions = await Competition.find({ apiCompetitionId: { $in: competitionIds } });

  // Iterate through each competition to fetch events for it
  for (const competitionApiId of competitionIds) {
    const competitionDetail = allCompetitions.find((competition) => competition.apiCompetitionId == competitionApiId);

    // Construct the URL to fetch events data for the current competition
    var eventUrl = `${appConfig.BASE_URL}?action=event&sport_id=${competitionDetail.apiSportId}&competition_id=${competitionDetail.apiCompetitionId}`;

    // Fetch events data from the API for the current competition
    const { statusCode, data } = await commonService.fetchData(eventUrl);

    // Check if the API request was successful (status code 200)
    if (statusCode === 200) {
      var eventObjArray = [];
      // Iterate through each event data for the current competition
      for (const event of data) {
        // Prepare the event object to be saved in the database
        const eventObj = {
          name: event.event.name,
          sportId: competitionDetail.sportId,
          apiSportId: competitionDetail.apiSportId,
          competitionId: competitionDetail._id,
          apiCompetitionId: competitionDetail.apiCompetitionId,
          apiEventId: event.event.id,
          matchDate: event.event.openDate,
          marketCount: event.marketCount,
        };

        eventObjArray.push(eventObj);
        evenyApiIds.push(event.event.id);
      }

      if (eventObjArray.length > 0) {
        // Bulk upsert operation
        const eventOps = eventObjArray.map((event) => ({
          updateOne: {
            filter: {
              apiSportId: event.apiSportId,
              apiCompetitionId: event.apiCompetitionId,
              apiEventId: event.apiEventId,
            },
            update: event,
            upsert: true,
          },
        }));

        await Event.bulkWrite(eventOps);
      }
    }
  }

  return evenyApiIds;
}

//Sync All Market
async function syncMarket(eventApiIds) {
  var marketIdsArray = [];

  //Get Bet Categories
  var betCategories = await BetCategory.find({ name: { $in: DEFAULT_CATEGORIES } });
  const betCategoryIdMap = betCategories.reduce((acc, betCategory) => {
    acc[betCategory.name] = betCategory._id;
    return acc;
  }, {});

  //Get all events information
  var allEvents = await Event.find({ apiEventId: { $in: eventApiIds } });

  // Iterate through each competition to fetch events for it
  for (const eventApiId of eventApiIds) {
    var eventDetail = allEvents.find((event) => event.apiEventId == eventApiId);

    // Construct the URL to fetch events data for the current competition
    var marketUrl = `${appConfig.BASE_URL}?action=market&event_id=${eventApiId}`;

    // Fetch market data from the API for the current event
    const { statusCode, data } = await commonService.fetchData(marketUrl);

    // Check if the API request was successful (status code 200)
    if (statusCode === 200) {
      var marketObjArray = [];

      // Iterate through each event data for the current competition
      for (const market of data) {
        var type_id = "";
        if (market.marketName === "Match Odds") {
          type_id = betCategoryIdMap[DEFAULT_CATEGORIES[0]];
        } else if (market.marketName === "Match Odds-BOOK MAKER-M") {
          type_id = betCategoryIdMap[DEFAULT_CATEGORIES[1]];
        } else {
          type_id = betCategoryIdMap[DEFAULT_CATEGORIES[2]];
        }

        //Prepare Object for market
        const marketObj = {
          name: market.marketName,
          typeId: type_id,
          marketId: market.marketId,
          apiEventId: eventDetail.apiEventId,
          eventId: eventDetail._id,
          apiCompetitionId: eventDetail.apiCompetitionId,
          competitionId: eventDetail.competitionId,
          apiSportId: eventDetail.apiSportId,
          sportId: eventDetail.sportId,
          marketRunners: market.runners,
          startDate: market.marketStartTime,
        };

        marketObjArray.push(marketObj);
        marketIdsArray.push(market.marketId);
      }

      if (marketObjArray.length > 0) {
        // Bulk upsert operation
        const marketOps = marketObjArray.map((market) => ({
          updateOne: {
            filter: {
              marketId: market.marketId,
              apiSportId: market.apiSportId,
              apiCompetitionId: market.apiCompetitionId,
              apiEventId: market.apiEventId,
            },
            update: market,
            upsert: true,
          },
        }));

        await Market.bulkWrite(marketOps);
      }
    }
  }

  return marketIdsArray;
}

// Function to get matchodds
const getMatchOdds = async (req, res) => {
  try {
    let allMarketId = req.body.markeId.toString().replace(/["']/g, "");
    var marketUrl = `${appConfig.BASE_URL}?action=matchodds&market_id=${allMarketId}`;
    const { statusCode, data } = await commonService.fetchData(marketUrl);
    let allData = [];
    if (statusCode === 200) {
      for (const market of data) {
        if (market["runners"]) {
          allData.push({
            marketId: market["marketId"],
            matchOdds: market["runners"].map(function (item) {
              delete item.ex;
              return item;
            })
          });
        } else {
          allData.push({
            marketId: market["marketId"],
            matchOdds: {
            },
          });
        }
      }
    }
    res.status(200).json({ message: "Match odds get successfully!", data: allData });
  } catch (e) {
    // Handle any errors that occurred during the sync process
    res.status(500).json({ error: "An error occurred" });
  }
};

export default {
  syncDetail,
  getMatchOdds,
};
