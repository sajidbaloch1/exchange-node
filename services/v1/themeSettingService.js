import ErrorResponse from "../../lib/error-handling/error-response.js";
import ThemeSetting from "../../models/v1/ThemeSetting.js";

/**
 * Fetch themeSetting by Id from the database
 */
const fetchThemeSettingId = async (userId) => {
  try {
    const existingThemeSetting = await ThemeSetting.findOne({ userId: userId });
    if (!existingThemeSetting) {
      throw new Error("Theme Setting not found!");
    }

    return existingThemeSetting;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * Create themeSetting in the database
 */
const addThemeSetting = async ({ ...reqBody }) => {
  const {
    userId,
    facebookLink,
    twitterLink,
    instagramLink,
    telegramLink,
    youtubeLink,
    whatsappLink,
    blogLink,
    footerMessage,
    news,
    supportNumber,
    forgotPasswordLink,
    depositePopupNumber,
    welcomeMessage
  } = reqBody;

  try {
    const newThemeSettingObj = {
      userId,
      facebookLink,
      twitterLink,
      instagramLink,
      telegramLink,
      youtubeLink,
      whatsappLink,
      blogLink,
      footerMessage,
      news,
      supportNumber,
      forgotPasswordLink,
      depositePopupNumber,
      welcomeMessage
    };
    const existingThemeSetting = await ThemeSetting.findOne({ userId: userId });
    if (existingThemeSetting) {
      throw new Error("Theme Setting already exists!");
    }
    const newThemeSetting = await ThemeSetting.create(newThemeSettingObj);

    return newThemeSetting;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

/**
 * update themeSetting in the database
 */
const modifyThemeSetting = async ({ ...reqBody }) => {
  try {
    const themeSetting = await ThemeSetting.findOne({ userId: reqBody.userId });

    if (!themeSetting) {
      throw new Error("ThemeSetting not found.");
    }
    themeSetting.facebookLink = reqBody.facebookLink;
    themeSetting.twitterLink = reqBody.twitterLink;
    themeSetting.instagramLink = reqBody.instagramLink;
    themeSetting.telegramLink = reqBody.telegramLink;
    themeSetting.youtubeLink = reqBody.youtubeLink;
    themeSetting.whatsappLink = reqBody.whatsappLink;
    themeSetting.blogLink = reqBody.blogLink;
    themeSetting.footerMessage = reqBody.footerMessage;
    themeSetting.news = reqBody.news;
    themeSetting.supportNumber = reqBody.supportNumber;
    themeSetting.forgotPasswordLink = reqBody.forgotPasswordLink;
    themeSetting.hardBetDeleted = reqBody.hardBetDeleted;
    themeSetting.depositePopupNumber = reqBody.depositePopupNumber;
    themeSetting.welcomeMessage = reqBody.welcomeMessage;
    await themeSetting.save();

    return themeSetting;
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};


export default {
  fetchThemeSettingId,
  addThemeSetting,
  modifyThemeSetting,
};
