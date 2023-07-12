import { isValidObjectId } from "mongoose";
import yup from "yup";

async function login() {
  return yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });
}

async function register() {
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
}

export default {
  login,
  register,
};
