// import amqp from "amqplib";

// let channel;

// // Connect to RabbitMQ
// export const connectRabbitMQ = async (io) => {
//   try {
//     const connection = await amqp.connect(process.env.RABBITMQ_URL);
//     channel = await connection.createChannel();

//     // Assert queue
//     const queue = "breaking-news";
//     await channel.assertQueue(queue, { durable: true });

//     // Consume messages
//     channel.consume(queue, async (msg) => {
//       if (msg) {
//         const alert = JSON.parse(msg.content.toString());
//         console.log("Received from RabbitMQ:", alert);

//         // Check if there are connected users
//         if (io.sockets.sockets.size > 0) {
//           io.emit("news-update", alert);
//         } else {
//           // If no users are online, store the message for specific users
//           const { userId, ...alertData } = alert;
//           console.log(
//             "No connected users. Storing message for offline delivery."
//           );

//           // Store the message in the MessageModel
//           const message = await MessageModel.create({ ...alertData, userId });

//           // Add userId to OfflineUserModel
//           let offlineUser = await offlineUserModel.findOne({ userId });
//           if (!offlineUser) {
//             offlineUser = await offlineUserModel.create({
//               userId,
//               messageIds: [message._id],
//             });
//           } else {
//             offlineUser.messageIds.push(message._id);
//             await offlineUser.save();
//           }
//         }

//         channel.ack(msg);
//       }
//     });

//     console.log("RabbitMQ connected and listening to queue:", queue);
//   } catch (error) {
//     console.error("RabbitMQ connection error:", error);
//   }
// };

// // Publish message to RabbitMQ
// export const publishMessage = async (queue, message) => {
//   try {
//     await channel.assertQueue(queue, { durable: true });
//     channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
//     console.log("Message sent to RabbitMQ:", message);
//   } catch (error) {
//     console.error("Error publishing to RabbitMQ:", error);
//   }
// };
