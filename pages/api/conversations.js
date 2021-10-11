import prisma from '../../lib/database';

// Para las conversaciones del usuario que ha iniciado sesión
export default async function conversationHandler(req, res) {
  switch (method) {
    case 'POST':
      const { userOne, userTwo } = req.body;

      const newConversation = await prisma.conversation.create({
        data: {
          userOne: {
            connect: { id: userOne },
          },
          userTwo: {
            connect: { id: userTwo },
          },
        },
      });

      res.status(200).json(newConversation);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
