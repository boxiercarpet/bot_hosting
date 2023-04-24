import express from "express";
import docker from "../docker.js";

const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("Welcome in CHub api!");
// });

router.post("/start", (req, res) => {
    var container = docker.getContainer("bot-"+req.user)
    
    container.inspect((err, data) => {
        if (err) {
            if (err.statusCode === 404) {
                // docker.createContainer({
                //     name: "bot-"+req.user,
                //     Image: "bot-js",
                //     HostConfig: {
                //         Binds: [`${process.cwd()+"/bots/"+req.user}:/usr/src/bot`],
                //     }
                // }).then(data => {
                //     container = data
                //     return container.start()
                // })
                docker.createContainer({
                    name: "bot-"+req.user,
                    Image: "bot-js",
                    WorkingDir: "/app",
                    HostConfig: {
                        Binds: [`${process.cwd()+"/bots/"+req.user}:/app`],
                        Privileged: false
                    },
                    Cmd: ['sh', '-c', 'npm install && node .']
                }).then(data => {
                    container = data
                    return container.start()
                })
            } else {
                console.log(err);
            }
        } else {
            container.start()
        }
    })
    res.send("OK")
})

router.post("/stop", (req, res) => {
    var container = docker.getContainer("bot-"+req.user)

    container.inspect((err, data) => {
        if (data.State.Running) {
            container.stop({t: 0})
        }
    })

    res.send("OK")
})

router.post("/restart", (req, res) => {
    var container = docker.getContainer("bot-"+req.user)

    container.inspect((err, data) => {
        if (data.State.Running) {
            container.restart({t: 0})
        }
    })

    res.send("OK")
})

router.get("/status", (req, res) => {
    var container = docker.getContainer("bot-"+req.user)

    container.inspect((err, data) => {
        if (!err) {
            res.send(data.State.Status)
        } else {
            res.send("no exist")
        }
    })
})

export default router;
