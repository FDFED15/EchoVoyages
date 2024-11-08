import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
    {
        username : {
            type: String,
            required: true,
            unique: true
        },
        Name : {
            type: String,
            required: true,
        },
        phno :{
            type: String,
            required: true
        },
        gmail : {
            type: String,
            required: true,
            unique: true
        },
        password : {
            type: String,
            required: true,
        },
        role :{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export const customers = mongoose.model('customers',customerSchema);