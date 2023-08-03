import themeUserService from "../../services/v1/themeUserService.js";
import themeUserRequest from "../../requests/v1/themeUserRequest.js";

// Create a new theme user
const createThemeUser = async (req, res) => {
    const { user, body } = await themeUserRequest.createThemeUserRequest(req);

    const newThemeUser = await themeUserService.addThemeUser({ user, ...body });

    res.status(201).json({ success: true, data: { details: newThemeUser } });
};

// Get theme user by ID
const getThemeUserById = async (req, res) => {
    const { _id = null, fields = {} } = req.body;

    if (!_id) {
        throw new Error("_id is required");
    }

    const themeUser = await themeUserService.fetchThemeUserId(_id, fields);

    res.status(200).json({ success: true, data: { details: themeUser } });
};

// Update a theme user
const updateThemeUser = async (req, res) => {
    const { user, body } = await themeUserRequest.updateThemeUserRequest(req);

    const updatedThemeUser = await themeUserService.modifyThemeUser({ user, ...body });

    res.status(200).json({ success: true, data: { details: updatedThemeUser } });
};

// Get all theme users
const getAllThemeUser = async (req, res) => {
    const { user, body } = await themeUserRequest.userListingRequest(req);

    const themeUsers = await themeUserService.fetchAllThemeUsers({ user, ...body });

    return res.status(200).json({ success: true, data: themeUsers });
};

// Delete a theme user
const deleteThemeUser = async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        throw new Error("_id is required!");
    }

    const deletedThemeUser = await themeUserService.removeThemeUser(_id);

    res.status(200).json({ success: true, data: { details: deletedThemeUser } });
};

// Login a theme user
const loginThemeUser = async (req, res) => {
    const { user, body } = await themeUserRequest.themeUserLoginRequest(req);

    const themeUser = await themeUserService.loginThemeUser({ user, ...body });
    res.status(200).json({ success: true, data: themeUser });
};

/**
 * Resets the theme user password.
 *
 **/
const resetPassword = async (req, res) => {
    const { body } = await themeUserRequest.themeUserResetPasswordRequest(req);

    const resetPasswordUser = await themeUserService.resetPassword({ ...body });
    return res.status(200).json({ success: true, data: resetPasswordUser });
};

export default {
    createThemeUser,
    getThemeUserById,
    updateThemeUser,
    getAllThemeUser,
    deleteThemeUser,
    loginThemeUser,
    resetPassword
};
