const createWebSocket = (url : string) => {
    return new WebSocket(url);
}

const closeWebSocket = (websocket : WebSocket) => {
    websocket && websocket.close();
}

export {
    createWebSocket,
    closeWebSocket
};

