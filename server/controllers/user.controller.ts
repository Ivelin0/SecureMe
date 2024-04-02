import express from "express";
import { User } from "../schemas/user.schema";
import jwt from "jsonwebtoken";
import { addToken } from "../utility/redis/redis.operations";
import { DeviceModel } from "../schemas/user.schema";
const register = async (req: express.Request, res: express.Response) => {
  const { username, password, fcm_token } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(403).send({ message: "user already exists" });
    return;
  }

  const user = new User({
    username,
    password,
  });

  const auth_token = jwt.sign(
    { data: { username } },
    String(process.env.JWT_SECRET_KEY),
    {
      expiresIn: String(process.env.JWT_LONG_LIVED),
    }
  );

  if (fcm_token) {
    let device: DeviceModel = { fcm_token: fcm_token };
    user.devices.push(device);

    user.save();
    addToken(username, { fcm_token });
  }
  await user.save();
  res.status(200).send({ message: "success", auth_token });
};

const login = async (req: express.Request, res: express.Response) => {
  const { username, password, fcm_token } = req.body;
  const userExists = await User.findOne({ username, password });

  if (!userExists) {
    res.status(403).send({ message: "username or password is incorrect" });
    return;
  }

  const auth_token = jwt.sign(
    { data: { username } },
    String(process.env.JWT_SECRET_KEY),
    {
      expiresIn: String(process.env.JWT_LONG_LIVED),
    }
  );
  if (fcm_token) {
    let device: DeviceModel = { fcm_token: fcm_token };
    userExists.devices.push(device);

    userExists.save();
    await addToken(username, { fcm_token });
  }
  res.status(200).send({ message: "success", auth_token });
};

export default { register, login };
