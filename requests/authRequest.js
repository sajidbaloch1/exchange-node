import { isValidObjectId } from "mongoose";
import Yup from "yup";

async function userLoginRequest(req) {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });

  await validationSchema.validate(req.body);

  return req;
}

async function userRegisterRequest(req) {
  req.body.username = req.body.username?.trim();
  req.body.password = req.body.password?.trim();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),

    password: Yup.string().required(),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required(),

    fullName: Yup.string().required(),

    currencyId: Yup.string()
      .required()
      .test("currencyId", "Invalid currencyId!", isValidObjectId),
  });

  await validationSchema.validate(req.body);

  return req;
}

export default {
  userLoginRequest,
  userRegisterRequest,
};
