//Import Service
import commonService from "../../services/v1/commonService.js";

import { appConfig } from "../../config/app.js";

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
  getMatchOdds,
};