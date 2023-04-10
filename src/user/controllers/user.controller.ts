import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import UserService from '../services/user.services'
import { Now } from "../../utils";
import setlog from "../../utils/setlog";
import config from "../../../config.json";
import { recoverPersonalData, toChecksumAddress } from "../../utils/blockchain";


const signup =  async (req: Request, res: Response) => {
		try {
			const { name, email, address, sign} = req.body;
			if (!(name?.toString().trim() )) return res.status(200).send({ message: "Please enter all required data." });
			const existsMail = await UserService.find({
				filter: { $or: [{ address: address }, { name: name }]}
			});
			if (existsMail.length > 0) {
				return res.status(200).send({ message: "Already exists same name or email or phone." });
			} else {
				const recoverData = recoverPersonalData(`Welcome to CBETWORLD! \n Click to sign in and accept the Terms of Service. \n This request will not trigger a blockchain transaction or cost any gas fees. \n Wallet address: ${address}`, sign)
				if(recoverData !== address) return res.status(200).json({message: "invalid signature"}); 
				await UserService.create({
					name: name,
					email: email,
					address: toChecksumAddress(address),
					created: Now(),
					lasttime: Now(),
				});
				return res.status(200).json({message: "success"});
			}
		} catch (err) {
			setlog("request", err);
			return res.status(200).send({ message: "internal error" });
		}
}

const login = async (req: Request, res: Response) => {
	try {
		const { address, sign} = req.body;
		const recoverData = recoverPersonalData(`Welcome to CBETWORLD! \n Click to sign in and accept the Terms of Service. \n This request will not trigger a blockchain transaction or cost any gas fees. \n Wallet address: ${address}`, sign)
		if(recoverData !== address) return res.status(200).json({message: "invalid signature"}); 
		const existsUser = await UserService.find({
			filter: { $or: [{ address: toChecksumAddress(address) }]}
		});
		if (existsUser.length == 0) {
			return res.status(200).send({ message: "No exists user." });
		} else {
			const data = {
				email: existsUser[0]?.email,
				name: existsUser[0]?.name,
				address: toChecksumAddress(address)
			};
			const token = jwt.sign(data, config.JWT_SECRET, {
				expiresIn: "144h",
			});
			await UserService.update({
				filter: { address: data.address },
				update: { lasttime: Now() }
			})
			return res.status(200).json({ message: "success", token});
		}
	} catch (err) {
		setlog("request", err);
		res.status(200).send({ message: "internal error" });
	}
}


const middleware = (req: any, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization || "";
		jwt.verify(
			token,
			config.JWT_SECRET,
			async (err: any, userData: any) => {
				if (err) return res.sendStatus(403);
				const user = await UserService.find({
					filter: {
						email: userData.email,
						lasttime: { "$gt": (Now() - 86400) },
					},
				});
				if (user.length == 0) return res.sendStatus(403);
				req.user = {
					name: userData.name,
					email: userData.email
				};
				await UserService.update({
					filter: {
						email: userData.email
					},
					update: {
						lasttime: Now()
					}
				});
				next();
			}
		);
	} catch (err: any) {
		if (err) return res.sendStatus(403);
	}
}

export default {
	middleware,
	login,
	signup
};
