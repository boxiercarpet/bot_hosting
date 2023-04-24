import { useEffect, useState } from "react"
import io from 'socket.io-client';
import styles from "./Dashboard.module.css"
import useApi from "../hooks/api";

const socket = io(process.env.NODE_ENV === 'development' ? "http://localhost:8080" : undefined, {
    auth: {token: localStorage.getItem("token")},
    autoConnect: false
})

export default function Dashboard() {
    var [logs, setLogs] = useState("")
    var [status, setStatus] = useState("")
    var [toBottom, setToBottom] = useState(0)
    var api = useApi()

    function updateStatus() {
        api.get("/bot/status").then(data => setStatus(data.data))
    }

    useEffect(() => {
        updateStatus()

        socket.connect()

        return () => {
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        socket.on("start", (event) => {
            console.log("Start");
            setLogs("")
            updateStatus()
        })
        
        socket.on("stop", (event) => {
            updateStatus()
        })

        return () => {
            socket.off("start")
            socket.off("stop")
        };
    }, [status])

    useEffect(() => {
        socket.on("log", (event) => {
            setLogs(prevLogs => prevLogs + event)
            if (toBottom < 20) {
                const pre = document.getElementsByTagName("pre")[0]
                pre.scrollTop = pre.scrollHeight-pre.clientHeight+10
            }
        })

        return () => {
            socket.off("log")
        }
    }, [logs])

    function start() {
        api.post("/bot/start")
    }

    function restart() {
        api.post("/bot/restart")
    }

    function stop() {
        api.post("/bot/stop")
    }

    function scrollListen(e) {
        setToBottom(e.target.scrollHeight-e.target.clientHeight-e.target.scrollTop)
    }

    return (
        <div className={styles.page}>
            <div className={styles.info}>
                <div>
                    <div className={styles.title}>Status</div>
                    <div>{status}</div>
                </div>
                <div>
                    <div className={styles.title}>FTP</div>
                    <div><b>Host:</b> ftp.hosting.chub.pl</div>
                    <div><b>Username:</b> {localStorage.getItem("user")}</div>
                    <div><b>Password:</b> same as to account</div>
                </div>
            </div>
            <div className={styles.buttons}>
                <div className={styles.start} onClick={start}>Start</div>
                <div className={styles.restart} onClick={restart}>Restart</div>
                <div className={styles.stop} onClick={stop}>Stop</div>
            </div>
            <pre onScroll={scrollListen}>{logs}</pre>
        </div>
    )
}