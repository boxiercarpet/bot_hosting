import express from "express";
import bcrypt from "bcrypt";
import sql from "./sql.js";
import { checkToken, genToken } from "./auth.js";
import bot from "./api/bot.js"

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome in CHub api!");
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    sql.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        const user = result[0];
        if (user) {
            const match = bcrypt.compareSync(password, user.password);

            if (match) {
                const token = genToken(user)
                res.status(200).json({ message: "Login successful.", token: token });
            } else {
                res.status(401).json({ message: "Invalid email or password." });
            }
        } else {
            res.status(401).json({ message: "Invalid email or password." });
        }
    })
});

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    sql.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err, response) => {
        res.status(201).json({ message: "User created." });
    });
});

router.use("/bot", checkToken, bot)

export default router;
