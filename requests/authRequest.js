import { isValidObjectId } from "mongoose";
import yup from "yup";

export const loginReqSchema = async () => {
  return yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });
};

export const registerReqSchema = async () => {
  return yup.object().shape({
    username: yup.string().required(),

    password: yup.string().required(),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required(),

    fullName: yup.string().required(),

    currencyId: yup
      .string()
      .required()
      .test("currencyId", "Invalid currencyId!", isValidObjectId),
  });
};
