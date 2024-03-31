import express from "express";
import User from "../schemas/user.schema";
import jwt from "jsonwebtoken";

const register = async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(403).send({ message: "user already exists" });
    return;
  }

  const user = new User({
    username,
    password,
  });

  const auth_token = jwt.sign({ data: { username } }, "secret", {
    expiresIn: "24h",
  });

  await user.save();
  res.status(200).send({ message: "success", auth_token });
};

const login = async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username, password });

  if (!userExists) {
    res.status(403).send({ message: "username or password is incorrect" });
    return;
  }

  const auth_token = jwt.sign({ data: { username } }, "secret", {
    expiresIn: "24h",
  });

  res.status(200).send({ message: "success", auth_token });
};

export default { register, login };