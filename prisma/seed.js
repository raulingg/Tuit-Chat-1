const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // const general = await prisma.room.create({
  //   data: {
  //     name: 'General',
  //   },
  // });

  // const newConversation = await prisma.conversation.create({
  //   data: {
  //     userOne: {
  //       connect: { id: 'ckud893em00002495to2x6qvz' },
  //     },
  //     userTwo: {
  //       connect: { id: 'ckud8ad0b00302495wuskjxun' },
  //     },
  //   },
  // });

  const newMessage = await prisma.message.create({
    data: {
      message: 'Holaaa',
      conversation: {
        connect: {
          id: 'ckud8lbd60007ek95p54ab3ak',
        },
      },
    },
  });

  // const bob = await prisma.user.upsert({
  //   where: { email: 'bob@prisma.io' },
  //   update: {},
  //   create: {
  //     email: 'bob@prisma.io',
  //     name: 'Bob',
  //     posts: {
  //       create: [
  //         {
  //           title: 'Follow Prisma on Twitter',
  //           content: 'https://twitter.com/prisma',
  //           published: true,
  //         },
  //         {
  //           title: 'Follow Nexus on Twitter',
  //           content: 'https://twitter.com/nexusgql',
  //           published: true,
  //         },
  //       ],
  //     },
  //   },
  // })
  console.log({ newMessage });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
