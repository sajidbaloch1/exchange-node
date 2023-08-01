import dashboardService from "../../services/v1/dashboardService.js";

// Get all Dashboard
const getDashboardById = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new Error("_id is required");
  }

  const dashboard = await dashboardService.fetchDashboardId(_id);
  res.status(200).json({ success: true, data: { details: dashboard } });
};
export default {
  getDashboardById,
};
