import { WebSocketServer,WebSocket } from "ws";

const wss=new WebSocketServer({port:8080});//zombie http server until it recives an http request to upgarde the connection
//runs own http server(Does heavy lifting) 
//actually ifthere is any active express or nodes server running on the similar port it hijacks that port connection and upgrade to ws connec
//on production the ws connec has to be upgraded froma a express or fastify server
//connextion event
wss.on('connection',(socket,request)=>{
    const ip=request.socket.remoteAddress;
    socket.on('message',(rawData)=>{
        const message=rawData.toString();
        console.log(message);
        wss.clients.forEach((client)=>{
            if(client.readyState===WebSocket.OPEN) client.send('Server Broadcast:${message}');
        })
    }) 
    socket.on('error',(err)=>{
        console.error(`Error: ${err.message}`);
    })
    socket.on('close',()=>{
        console.log('client connection closed');
    })
});
console.log(`Websocket Server is live on ws://localhost:8080`);