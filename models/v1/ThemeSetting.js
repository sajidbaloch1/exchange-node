import mongoose from "mongoose";
import timestampPlugin from "../plugins/timestamp.js";

const themeSettingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // References the 'User' model for the user.
        required: true,
    },
    facebookLink: {
        type: String,
        default: null,
    },
    twitterLink: {
        type: String,
        default: null,
    },
    instagramLink: {
        type: String,
        default: null,
    },
    telegramLink: {
        type: String,
        default: null,
    },
    youtubeLink: {
        type: String,
        default: null,
    },
    whatsappLink: {
        type: String,
        default: null,
    },
    blogLink: {
        type: String,
        default: null,
    },
    footerMessage: {
        type: String,
        default: null,
    },
    news: {
        type: String,
        default: null,
    },
    supportNumber: {
        type: String,
        default: null,
    },
    forgotPasswordLink: {
        type: String,
        default: null,
    },
    depositePopupNumber: {
        type: String,
        default: null,
    },
    welcomeMessage: {
        type: String,
        default: null,
    },
})

themeSettingSchema.plugin(timestampPlugin);

const ThemeSetting = mongoose.model("theme_setting", themeSettingSchema);

export default ThemeSetting;