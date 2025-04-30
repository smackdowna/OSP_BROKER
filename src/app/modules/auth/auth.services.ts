import { TUser , TLoginAuth } from "./auth.interface";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import {createToken} from "./auth.utils"
import jwt , {JwtPayload}from "jsonwebtoken";

import prismadb from "../../db/prismaDb";
import config from "../../config";

import z from "zod";

const emailSchema = z.string().email();

// create user
const createUser = async (payload: Partial<TUser>) => {
  const { fullName, email, password, role, phone, userProfile, representative, businessAdmin, moderator, admin } = payload;

  if (!fullName || !email || !password || !role || !phone) {
    throw new AppError(400, "please provide all fields");
  }

  const emailValidation = emailSchema.safeParse(email);
  if (!emailValidation.success) {
    throw new AppError(400, "Invalid email format");
  }

  const existingUser = await prismadb.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new AppError(400, "User already exists with this email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Define mapping from role to relation name
  const roleToRelation = {
    USER: 'userProfile',
    REPRESENTATIVE: 'representative',
    BUSINESS_ADMIN: 'businessAdmin',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
  };

  // Set dynamic include option based on the role
  const relationName = roleToRelation[role];
  const includeOption = relationName ? { [relationName]: true } : {};

  const user = await prismadb.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role,
      phone,
      ...(role === 'USER' && userProfile ? {
        userProfile: {
          create: {
            headLine: userProfile.headLine,
            location: userProfile.location,
            about: userProfile.about,
            profileImageUrl: userProfile.profileImageUrl,
            skills: userProfile.skills,
            socialLinks: userProfile.socialLinks,
            education: userProfile.education ? { create: userProfile.education } : undefined,
            experience: userProfile.experience ? { create: userProfile.experience } : undefined,
          },
        },
      } : {}),
      ...(role === 'REPRESENTATIVE' && representative ? {
        representative: {
          create: representative,
        },
      } : {}),
      ...(role === 'BUSINESS_ADMIN' && businessAdmin ? {
        businessAdmin: {
          create: businessAdmin,
        },
      } : {}),
      ...(role === 'MODERATOR' && moderator ? {
        moderator: {
          create: moderator,
        },
      } : {}),
      ...(role === 'ADMIN' && admin ? {
        admin: {
          create: admin,
        },
      } : {}),
    },
    include: includeOption,
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

// login user
const loginUser = async (payload: TLoginAuth) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new AppError(400, "Please provide all fields");
    }

    const user = await prismadb.user.findFirst({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError(401, "Invalid credentials");
    }

    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
      };
    
      const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
      );
    
      const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
      );
    
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone
        },
      }
}

// refresh token service to get new access token using refresh token
const refreshToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError(401, "Please provide refresh token");
    }

    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;

    const {email}= decoded as {email:string};

    const user = await prismadb.user.findFirst({
        where: {
            email: email,
        },
    });

    if(!user) {
        throw new AppError(401, "user not found");
    }

    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );

    return {accessToken};
}

// get all users
const getUsers = async () => {
    const users = await prismadb.user.findMany();
    if (!users || users.length === 0) {
        throw new AppError(404, "No users found");
    }
    return users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
}

// get user by id
const getUserById = async (id: string) => {
    const user = await prismadb.user.findFirst({
        where: {
            id: id,
        },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}


export const authServices = {
    createUser,
    loginUser,
    refreshToken,
    getUsers,
    getUserById
};