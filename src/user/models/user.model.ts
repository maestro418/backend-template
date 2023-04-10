import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		default: "",
	},
	email: {
		type: String,
		default: "",
	},
	address: {
		type: String,
		default: '', 
	},
	lasttime: {
		type: Number,
		default: 0,
	},
	created: {
		type: Number,
		default: 0,
	}
});


export const USER = mongoose.model("users", UserSchema);
