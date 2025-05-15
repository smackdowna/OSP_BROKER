import config from "../../config";
import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import { createToken } from "../auth/auth.utils";
import { Response } from "express";

// assign moderator role to user

const assignModerator = async (res: Response,userId: string,categoryId: string) => {
    console.log("this is category id", categoryId);
  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

const existingModerator = await prismadb.moderator.findFirst({
  where: {
    userId: user.id,
  },
});

let moderator;

if (!existingModerator) {
   moderator = await prismadb.moderator.create({
    data: {
      userId: user.id,
      categoryIds: [categoryId], 
    },
  });
} else {
   moderator = await prismadb.moderator.update({
    where: {
      userId: user.id,
    },
    data: {
      categoryIds: [...existingModerator.categoryIds, categoryId], 
    },
  });
}

const updatedUser = await prismadb.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "MODERATOR",
    },
  });

  const newToken = createToken(
    {
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role, // Updated role
    },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Set the new token in the cookie
  res.cookie("accessToken", newToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { user: updatedUser, moderator };
};

// remove moderator role from user
const removeModerator = async (userId: string) => {
  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role !== "MODERATOR") {
    throw new AppError(400, "User is not a moderator");
  }

  await prismadb.user.update({
    where: {
      id: userId,
    },
    data: {
      role: "USER",
    },
  });

  const moderator = await prismadb.moderator.delete({
    where: {
      userId: user.id,
    },
  });

  return { moderator };
};

export const adminServices = {
  assignModerator,
  removeModerator,
};
