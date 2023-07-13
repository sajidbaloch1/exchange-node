import { isValidObjectId } from "mongoose";
import Yup from "yup";

async function loginSchema() {
  const requestSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });

  return requestSchema;
}

async function registerSchema(req) {
  req.body.username = req.body.username?.trim();
  req.body.password = req.body.password?.trim();

  const requestSchema = Yup.object().shape({
    username: Yup.string().required(),

    password: Yup.string().required(),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required(),

    fullName: Yup.string().required(),

    currencyId: Yup.string()
      .required()
      .test("currencyId", "Invalid currencyId!", isValidObjectId),
  });

  return requestSchema;
}

export default {
  loginSchema,
  registerSchema,
};
