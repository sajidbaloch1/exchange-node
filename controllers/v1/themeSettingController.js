import themeSettingRequest from "../../requests/v1/themeSettingRequest.js";
import themeSettingService from "../../services/v1/themeSettingService.js";

// Get themeSetting by ID
const getThemeSettingById = async (req, res) => {
  const { userId = null } = req.body;

  if (!userId) {
    throw new Error("userId is required");
  }

  const themeSetting = await themeSettingService.fetchThemeSettingId(userId);

  res.status(200).json({ success: true, data: { details: themeSetting } });
};

// Update a themeSetting
const updateThemeSetting = async (req, res) => {
  const { body } = await themeSettingRequest.updateThemeSettingRequest(req);

  const updatedThemeSetting = await themeSettingService.modifyThemeSetting({ ...body, files: req.files });

  res.status(200).json({ success: true, data: { details: updatedThemeSetting } });
};

const deleteBanner = async (req, res) => {
  const { _id = null, bannerImageName = null } = req.body;

  if (!(_id && bannerImageName)) {
    throw new Error("_id and bannerImageName is required");
  }

  const result = await themeSettingService.deleteBannerImage({ _id, bannerImageName });

  res.status(200).json({ success: true, data: { details: result } });
};

// Get Super admin theme setting
const getThemeSettingByCurrencyAndDomain = async (req, res) => {
  const { body } = await themeSettingRequest.getThemeSettingByCurrencyAndDomainRequest(req);

  const updatedThemeSetting = await themeSettingService.getThemeSettingByCurrencyAndDomain({ ...body });

  res.status(200).json({ success: true, data: { details: updatedThemeSetting } });
};

export default {
  getThemeSettingById,
  updateThemeSetting,
  deleteBanner,
  getThemeSettingByCurrencyAndDomain,
};
