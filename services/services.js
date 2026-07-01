import { createLoginToken } from "../auth/auth.js";
import { appModels } from "../models/models.js";

async function loginServices({ username, password }) {
  const result = await appModels.loginModel({
    username,
    password,
  });

  if (result.id) {
    let token = await createLoginToken({
      username: result.username,
      id: result.id,
      email: result.email,
    });

    return { ...result, token };
  }

  return result;
}

const appServices = { loginServices };

export { appServices };
