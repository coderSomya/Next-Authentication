import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"

connect()


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        //check if user exists

        const user= await User.findOne({email});
      

        if(user){
            return NextResponse.json(
                {error: "User already exists",
                status: 400}
            )
        }

        //hash password

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        //create new user
        const newUser = new User({
           username, email,
           password: hashedPassword
        })

        console.log(newUser);
        
        const savedUser = await newUser.save();
        console.log(savedUser);

     
        return new NextResponse(
           JSON.stringify({message: "User created successfully",
            status: 200})
        )
           
    } catch (error: any) {
       
        return NextResponse.json({
            error: error.message,
        }, {status: 500})
    }
}