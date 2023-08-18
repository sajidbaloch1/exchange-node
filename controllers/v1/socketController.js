//Import Service
import commonService from "../../services/v1/commonService.js";

import { appConfig } from "../../config/app.js";

// Function to get matchodds
const getMatchOdds = async (markeId) => {
  try {
    let allMarketId = markeId.toString().replace(/["']/g, "");
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
    return allData;

  }
  catch (e) {
    return e;
  }
}

export default {
  getMatchOdds,
};