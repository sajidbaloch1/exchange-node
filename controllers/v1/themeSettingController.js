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

// Create a new themeSetting
const createThemeSetting = async (req, res) => {
    const { body } = await themeSettingRequest.createThemeSettingRequest(req);

    const newThemeSetting = await themeSettingService.addThemeSetting({ ...body });

    res.status(201).json({ success: true, data: { details: newThemeSetting } });
};

// Update a themeSetting
const updateThemeSetting = async (req, res) => {
    const { body } = await themeSettingRequest.updateThemeSettingRequest(req);

    const updatedThemeSetting = await themeSettingService.modifyThemeSetting({ ...body });

    res.status(200).json({ success: true, data: { details: updatedThemeSetting } });
};


export default {
    getThemeSettingById,
    createThemeSetting,
    updateThemeSetting
};