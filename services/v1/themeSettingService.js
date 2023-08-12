import { nanoid } from "nanoid";
import ErrorResponse from "../../lib/error-handling/error-response.js";
import { uploadImageToS3 } from "../../lib/files/image-upload.js";
import ThemeSetting, { THEME_IMAGE_SIZES, THEME_IMAGE_TYPES } from "../../models/v1/ThemeSetting.js";

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
 * Upload theme images to S3
 * @param {String} themeSettingId
 * @param {Array} files
 * @returns {Promise<void>}
 */
const uploadThemeImages = async (themeSettingId, files) => {
  const themeSetting = await ThemeSetting.findById(themeSettingId);

  const { bannerImages = [], welcomeMobileImage, welcomeDesktopImage } = files;

  const imagePromises = [];

  const bannerImageNames = [];

  // Banner Images
  if (bannerImages.length) {
    bannerImages.forEach((image) => {
      const sizes = [
        THEME_IMAGE_SIZES.BANNER.ORIGINAL,
        THEME_IMAGE_SIZES.BANNER.DEFAULT,
        THEME_IMAGE_SIZES.BANNER.THUMBNAIL,
      ];
      sizes.forEach((size) => {
        const name = nanoid();
        const path = themeSetting.generateImagePath(THEME_IMAGE_TYPES.BANNER, size, name);
        imagePromises.push(uploadImageToS3({ image, path, size }));
        bannerImageNames.push(name);
      });
    });
  }

  // Welcome Image Mobile
  if (welcomeMobileImage) {
    const sizes = [
      THEME_IMAGE_SIZES.WELCOME_MOBILE.ORIGINAL,
      THEME_IMAGE_SIZES.WELCOME_MOBILE.DEFAULT,
      THEME_IMAGE_SIZES.WELCOME_MOBILE.THUMBNAIL,
    ];
    sizes.forEach((size) => {
      const path = themeSetting.generateImagePath(THEME_IMAGE_TYPES.WELCOME_MOBILE, size);
      imagePromises.push(uploadImageToS3({ image: welcomeMobileImage, path, size }));
    });
  }

  // Welcome Image Desktop
  if (welcomeDesktopImage) {
    const sizes = [
      THEME_IMAGE_SIZES.WELCOME_DESKTOP.ORIGINAL,
      THEME_IMAGE_SIZES.WELCOME_DESKTOP.DEFAULT,
      THEME_IMAGE_SIZES.WELCOME_DESKTOP.THUMBNAIL,
    ];
    sizes.forEach((size) => {
      const path = themeSetting.generateImagePath(THEME_IMAGE_TYPES.WELCOME_DESKTOP, size);
      imagePromises.push(uploadImageToS3({ image: welcomeDesktopImage, path, size }));
    });
  }

  await Promise.all(imagePromises)
    .then((results) => console.log(results))
    .catch((e) => console.log(e));

  if (bannerImageNames.length) {
    themeSetting.bannerImages = bannerImageNames;
    await themeSetting.save();
  }
};

/**
 * update themeSetting in the database
 */
const modifyThemeSetting = async ({ files, ...reqBody }) => {
  try {
    const themeSetting = await ThemeSetting.findOne({ userId: reqBody.userId });

    if (!themeSetting) {
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
        welcomeMessage,
      } = reqBody;

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
        welcomeMessage,
      };

      const newThemeSetting = await ThemeSetting.create(newThemeSettingObj);

      await uploadThemeImages(themeSetting._id, files);

      return newThemeSetting;
    } else {
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

      await uploadThemeImages(themeSetting._id, files);

      return themeSetting;
    }
  } catch (e) {
    throw new ErrorResponse(e.message).status(200);
  }
};

export default {
  fetchThemeSettingId,
  modifyThemeSetting,
};
