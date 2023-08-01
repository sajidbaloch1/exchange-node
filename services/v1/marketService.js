import ErrorResponse from "../../lib/error-handling/error-response.js";
import Sport from "../../models/v1/Sport.js";
import Competition from "../../models/v1/Competition.js";
import Event from "../../models/v1/Event.js";
import Market from "../../models/v1/Market.js";
import BetCategory, { DEFAULT_CATEGORIES } from "../../models/v1/BetCategory.js";

const syncMarkets = async (data) => {
  //Get Bet Categories
  var betCategories = await BetCategory.find({ name: { $in: DEFAULT_CATEGORIES } });
  const betCategoryIdMap = betCategories.reduce((acc, betCategory) => {
    acc[betCategory.name] = betCategory._id;
    return acc;
  }, {});

  // Extract the fields separately
  const competitionIds = data.map((item) => item.stCompititionID);
  const eventIds = data.map((item) => item.stEventID);
  const sportsIds = data.map((item) => item.stSportsID);

  //Get All Sports
  var sports = await Sport.find({ apiSportId: { $in: sportsIds } });
  // Create an array of objects with sportId as key and _id as value
  const sportIdMap = sports.reduce((acc, sport) => {
    acc[sport.apiSportId] = sport._id;
    return acc;
  }, {});

  //Get All Competition
  var competitions = await Competition.find({ apiCompetitionId: { $in: competitionIds } });
  // Create an array of objects with competitionId as key and _id as value
  const competitionIdMap = competitions.reduce((acc, competition) => {
    acc[competition.apiCompetitionId] = competition._id;
    return acc;
  }, {});

  //Get All Events
  var events = await Event.find({ apiEventId: { $in: eventIds } });
  // Create an array of objects with eventId as key and _id as value
  const eventIdMap = events.reduce((acc, event) => {
    acc[event.apiEventId] = event._id;
    return acc;
  }, {});

  var allMarketData = [];
  data.map((record) => {
    if (
      sportIdMap.hasOwnProperty(record.stSportsID) &&
      competitionIdMap.hasOwnProperty(record.stCompititionID) &&
      eventIdMap.hasOwnProperty(record.stEventID)
    ) {
      var marketId = record.stMarketID;
      var type_id = "";
      if (record.stMarketName === "Match Odds") {
        type_id = betCategoryIdMap[DEFAULT_CATEGORIES[0]];
      } else if (record.stMarketName === "Match Odds-BOOK MAKER-M") {
        type_id = betCategoryIdMap[DEFAULT_CATEGORIES[1]];
      } else {
        type_id = betCategoryIdMap[DEFAULT_CATEGORIES[2]];
      }

      var market = {
        name: record.stEventName,
        typeId: type_id,
        marketStatus: record.btMarketStatus,
        marketId: record.stMarketID,
        apiEventId: record.stEventID,
        eventId: eventIdMap[record.stEventID],
        apiCompetitionId: record.stCompititionID,
        competitionId: competitionIdMap[record.stCompititionID],
        apiSportId: record.stSportsID,
        sportId: sportIdMap[record.stSportsID],
        marketRunners: record.submaster,
        startDate: record.dtStartDate,
      };

      allMarketData.push({
        updateOne: {
          filter: { marketId }, // Use the unique identifier for the document
          update: { $set: market }, // Use $set to update specified fields
          upsert: true, // Create a new document if it doesn't exist
        },
      });
    }
    // else {
    //   console.log(record);
    // }
  });

  // Perform the bulkWrite operation
  const result = await Market.bulkWrite(allMarketData);
  return result;
};

export default { syncMarkets };
