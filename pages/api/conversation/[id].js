import prisma from '../../../lib/database';

export default async function conversationHandler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      // Get data from your database
      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [{ userOneId: id }, { userTwoId: id }],
        },
        select: {
          userOneId: {
            select: {
              name: true,
            },
          },
          userTwoId: {
            select: {
              name: true,
            },
          },
          messages: {
            select: {
              message: true,
              createdAt: true,
            },
          },
        },
      });

      res.status(200).json(conversations);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
