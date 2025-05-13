import { TUser , TLoginAuth } from "./auth.interface";
import bcrypt from "bcrypt";
import AppError from "../../errors/appError";
import {createToken} from "./auth.utils"
import jwt , {JwtPayload}from "jsonwebtoken";
import oauth2Client from "../../config/oAuth.config";
import axios from "axios";
import appleSignin from "apple-signin-auth";

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
    return users.map((user:TUser) => {
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

// google authentication
const googleSignIn= async (code: string) => {
  if(!code) {
    throw new AppError(400, "Please provide code");
  }

  console.log("This is code", code)

  const {tokens}= await oauth2Client.getToken({
    code,
    redirect_uri: config.google_redirect_uri
  });
  oauth2Client.setCredentials(tokens);

  const userRes= await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`)
  console.log("This is userRes" , userRes)

  if(!userRes){
    throw new AppError(400, "Unable to fetch user data from google");
  }

  // check existing user
  let user= await prismadb.user.findFirst({
    where: {
      email: userRes.data.email
    }
  })

  if(!user){
    user= await prismadb.user.create({
      data: {
        fullName: userRes.data.name,
        email: userRes.data.email,
        password: "",
        role: "USER",
        phone: "",
        userProfile: {
          create: {
            headLine: "",
            location: "",
            about: "",
            profileImageUrl: userRes.data.picture,
            skills: [],
            socialLinks: [],
            education: {
              create: []
            },
            experience: {
              create:[]
            }
          }
        }
      }
    })}
    const accessToken= createToken({
      userId: user.id.toString(),
      email: user.email,
      role: user.role
    }, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

    return {
      accessToken,
      user
    }
}

const appleSignIn = async (id_token: string)=>{
  if(!id_token){
    throw new AppError(400, "Please provide code");
  }

  const userData = await appleSignin.verifyIdToken(id_token, {
    audience: config.apple_client_id,
    ignoreExpiration: true,
  });

  if(!userData || !userData.email){
    throw new AppError(400, "Unable to fetch user data from apple");
  }

  console.log("This is userData", userData)

  const email= userData.email;
  
  let user= await prismadb.user.findFirst({
    where: {
      email: email
    }
  })

  if(!user){
    user= await prismadb.user.create({
      data: {
        fullName: "apple user",
        email: userData.email,
        password: "",
        role: "USER",
        phone: "",
        userProfile: {
          create: {
            headLine: "",
            location: "",
            about: "",
            profileImageUrl: "",
            skills: [],
            socialLinks: [],
            education: {
              create: []
            },
            experience: {
              create:[]
            }
          }
        }
      }
    })
  }

  const accessToken= createToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role
  }, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

  return {
    accessToken,
    user
  }
}



export const authServices = {
    createUser,
    loginUser,
    refreshToken,
    getUsers,
    getUserById,
    googleSignIn,
    appleSignIn
};