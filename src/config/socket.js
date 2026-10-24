let io;

export const setSocketIO = (socketServer) => {
    io = socketServer;
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.io todavía no está inicializado');
    }

    return io;
};
