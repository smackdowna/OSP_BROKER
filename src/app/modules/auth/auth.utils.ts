import jwt, { SignOptions } from 'jsonwebtoken';

export const createToken = (jwtPayload : {email?:string , role?:string,categoryName?:string, userId:string}, secret:string, expiresIn:string) => {
    const token = jwt.sign(jwtPayload, secret , {expiresIn} as SignOptions);

    return token;
};