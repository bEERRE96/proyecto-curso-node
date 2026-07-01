import jwt from "jsonwebtoken";

async function createLoginToken({ username, id, email }) {
  try {
    let token = jwt.sign(
      {
        username,
        id,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo generar la autenticación, vuelva a intentarlo");
  }
}

export { createLoginToken };
