import marketService from "../../services/v1/marketService.js";

const getMatchOdds = async (req, res) => {
  try {
    const allData = await marketService.getMatchOdds(req.body.markeId);
    res.status(200).json({ message: "Match odds get successfully!", data: allData });
  } catch (e) {
    res.status(500).json({ error: "An error occurred" });
  }
};

export default {
  getMatchOdds,
};
