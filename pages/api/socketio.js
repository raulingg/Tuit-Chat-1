import { Server as ServerIO } from 'socket.io';
import crypto from 'crypto';
import InMemorySessionStore from '../../lib/sessionStore';

export const config = {
  api: {
    bodyParser: false,
  },
};

const sessionStore = new InMemorySessionStore();
const randomId = () => crypto.randomBytes(8).toString('hex');

const socket = async (req, res) => {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server;

    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });

    io.use((socket, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      const username = socket.handshake.auth.username;
      const userID = socket.handshake.auth.userID;

      if (sessionID) {
        const session = sessionStore.findSession(sessionID);

        if (session) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.username = session.username;
          return next();
        }
      }

      if (!username) {
        return next(new Error('invalid username'));
      }

      // create new session
      socket.sessionID = randomId();
      socket.userID = userID;
      socket.username = username;
      next();
    });

    io.on('connection', (socket) => {
      // persist session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
      });

      // emit session details
      socket.emit('session', {
        sessionID: socket.sessionID,
        userID: socket.userID,
      });

      // make the Socket instance join the associated room
      // join the "userID" room
      socket.join(socket.userID);

      // fetch existing users
      const users = [];
      sessionStore.findAllSessions().forEach((session) => {
        users.push({
          userID: session.userID,
          username: session.username,
          connected: session.connected,
        });
      });

      socket.emit('users', users);
      // const mapSockets = io.of('/').sockets;
      // mapSockets.forEach((value, key) => {
      //   users.push({
      //     userID: key,
      //     username: value.username,
      //   });
      // });

      // notify existing users
      // emit to all connected clients, except the socket itself.
      socket.broadcast.emit('user connected', {
        userID: socket.userID,
        username: socket.username,
        connected: true,
      });

      // forward the private message to the right recipient
      socket.on('private message', ({ content, to }) => {
        // broadcast in both the recipient and the sender
        socket.to(to).to(socket.userID).emit('private message', {
          content,
          from: socket.userID,
          to,
        });
      });

      // notify users upon disconnection
      socket.on('disconnect', async () => {
        // returns a Set containing the ID of all Socket instances that are in the given room
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;

        if (isDisconnected) {
          // notify other users
          socket.broadcast.emit('user disconnected', socket.userID);
          // update the connection status of the session
          sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: false,
          });
        }
      });
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default socket;
