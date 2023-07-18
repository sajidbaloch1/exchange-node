import UserActivity from "../../models/v1/UserActivity.js";

const createUserActivity = async ({
  userId,
  event,
  ipAddress,
  description,
}) => {
  try {
    const userActivity = new UserActivity({
      userId,
      event,
      ipAddress,
      description,
    });
    await userActivity.save();
    return userActivity;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { createUserActivity };
