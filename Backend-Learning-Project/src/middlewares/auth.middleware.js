import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { JsonWebTokenError } from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT=asyncHandler(async(req,res)=>{
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token){
       throw new ApiError(401,"Unauthorized request")
    }

    const decodedToken=JsonWebTokenError.verifyJWT(token,process.env.ACCESS_TOKEN_SECRET)

    if(!User){
        throw new ApiError(401, "Invalid Access Token")
    }
})