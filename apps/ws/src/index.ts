import { WebSocketServer } from "ws";
import { verify } from "jsonwebtoken"
import { prisma } from "@repo/db";
import { authenticationUserBeforeOnline } from "./authentication";


const wss = new WebSocketServer({ port: 8080 });

const onlineUsers = new Map();

wss.on("connection", async (ws, req: Request) => {

    const verifyInfo = await authenticationUserBeforeOnline(ws, req);
    if (!verifyInfo) {
        return;
    }
    // set user or online user
    onlineUsers.set(verifyInfo.decoded.userId, {
        name: verifyInfo.user.username,
        ws,
        id: verifyInfo.user.id
    })
    // send this event to everyone that someone just become online
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({
            type: "ONLINE_USERS",
            payload: {
                users: Array.from(onlineUsers)
            }
        }))
    })



    ws.on("message", (event) => {
        const parsedData = JSON.parse(event.toString());

        if (parsedData.type = "JOIN") {
            // onlineUsers.set();
        }
    })
})