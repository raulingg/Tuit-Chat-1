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
      const name = socket.handshake.auth.name;
      const ID = socket.handshake.auth.ID;

      if (sessionID) {
        const session = sessionStore.findSession(sessionID);

        if (session) {
          socket.sessionID = sessionID;
          socket.ID = session.ID;
          socket.name = session.name;
          return next();
        }
      }

      if (!name) {
        return next(new Error('invalid username'));
      }

      // create new session
      socket.sessionID = ID;
      socket.ID = ID;
      socket.name = name;
      next();
    });

    io.on('connection', (socket) => {
      // persist session
      sessionStore.saveSession(socket.sessionID, {
        ID: socket.ID,
        name: socket.name,
        connected: true,
      });

      // emit session details
      socket.emit('session', {
        sessionID: socket.sessionID,
        ID: socket.ID,
      });

      // make the Socket instance join the associated room
      // join the "userID" room
      socket.join(socket.ID);
      socket.join('ckud67qq400000s95fv33xngb');

      // fetch existing users
      const users = [];
      sessionStore.findAllSessions().forEach((session) => {
        users.push({
          ID: session.ID,
          name: session.name,
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

      socket.on('join room', (room) => {
        socket.join(room);
      });

      // Para los rooms
      socket.on('send message', ({ content, to }) => {
        socket.to(to).emit('new message', {
          content,
          sender: socket.name,
          from: socket.ID,
          to,
        });
      });

      // notify existing users
      // emit to all connected clients, except the socket itself.
      socket.broadcast.emit('user connected', {
        ID: socket.ID,
        name: socket.name,
        connected: true,
      });

      // forward the private message to the right recipient
      socket.on('private message', ({ content, to }) => {
        // broadcast in both the recipient and the sender
        socket.to(to).to(socket.ID).emit('private message', {
          content,
          from: socket.ID,
          to,
        });
      });

      // notify users upon disconnection
      socket.on('disconnect', async () => {
        // returns a Set containing the ID of all Socket instances that are in the given room
        const matchingSockets = await io.in(socket.ID).allSockets();
        const isDisconnected = matchingSockets.size === 0;

        if (isDisconnected) {
          // notify other users
          socket.broadcast.emit('user disconnected', socket.ID);
          // update the connection status of the session
          sessionStore.saveSession(socket.sessionID, {
            ID: socket.ID,
            name: socket.name,
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
