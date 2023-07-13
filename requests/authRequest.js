import { isValidObjectId } from "mongoose";
import yup from "yup";

export const loginReqSchema = async () => {
  const requestSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  return requestSchema;
};

export const registerReqSchema = async (req) => {
  req.body.username = req.body.username?.trim();
  req.body.password = req.body.password?.trim();

  const requestSchema = yup.object().shape({
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

  return requestSchema;
};
