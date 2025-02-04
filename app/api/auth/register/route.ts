import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if(!email || !password) {
            return NextResponse.json({error: "Email or password is missing"}, {status: 400});
        }

        await connectToDatabase()

        const isExist = await User.findOne({email});

        if(isExist) {
            return NextResponse.json({error: "User already exist"}, {status: 400});
        }

        await User.create({email, password});

        return NextResponse.json({message: 'User created successfully', status: 201});

    } catch (error) {
        console.log(error);
        NextResponse.json({error: 'Failed to user registered.!!!', status: 500});
    }
}