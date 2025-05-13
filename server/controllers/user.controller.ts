import { DeviceDocument, User } from "../schemas/user.schema";
import { DeviceModel } from "../schemas/user.schema";

import { addMobileData } from "../utility/redis/redis.operations";
import express from "express";
import jwt from "jsonwebtoken";
const register = async (req: express.Request, res: express.Response) => {
  const { username, password, fcm_token, full_model } = req.body;

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
    const isDuplicate: boolean =
      (await DeviceModel.findOne({ fcm_token })) != null;
    if (isDuplicate) {
      await DeviceModel.deleteOne({ fcm_token });
    }

    let device: DeviceDocument = new DeviceModel({
      fcm_token: fcm_token,
      locations: [],
      booted: [],
      full_model,
    });

    await device.save();
    user.devices.push(device);

    await user.save();

    await addMobileData(username, { fcm_token });
  }

  await user.save();
  res.status(200).send({ message: "success", auth_token });
};

const login = async (req: express.Request, res: express.Response) => {
  const { username, password, fcm_token, full_model } = req.body;
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
    const isDuplicate: any = await DeviceModel.aggregate([
      {
        $match: { username: { $ne: username } },
      },
      { $unwind: "$devices" },
      { $match: { "devices.fcm_token": fcm_token } },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          devices: { $push: "$devices" },
        },
      },
    ]);
    if (isDuplicate) {
      await DeviceModel.deleteOne({ fcm_token });
    }

    let device = new DeviceModel({ fcm_token: fcm_token, full_model });
    const result = await User.aggregate([
      { $match: { username: username } },
      {
        $lookup: {
          from: "devices",
          localField: "devices",
          foreignField: "_id",
          as: "devices",
        },
      },
      { $unwind: "$devices" },
      { $match: { "devices.fcm_token": fcm_token } },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          devices: { $push: "$devices" },
        },
      },
    ]);

    if (result.length === 0) {
      userExists.devices.push(device);
      await device.save();

      await userExists.save();
      addMobileData(username, { fcm_token });

    }
  }
  res.status(200).send({ message: "success", auth_token });
};

export default { register, login };
