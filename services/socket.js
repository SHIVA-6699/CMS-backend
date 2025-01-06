// import MessageModel from "../models/AlertsModels/message.model.js";
// import offlineUserModel from "../models/AlertsModels/offlineUser.model.js";

// const socketService = (io) => {
//   io.on("connection", async (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     const userId = socket.handshake.query.userId;

//     // Fetch and deliver offline messages for the reconnecting user
//     const offlineMessages = await MessageModel.find({
//       userId,
//       isDelivered: false,
//     });

//     if (offlineMessages.length > 0) {
//       console.log(
//         `Sending ${offlineMessages.length} offline messages to user: ${userId}`
//       );

//       // Deliver messages to the user
//       offlineMessages.forEach(async (message) => {
//         socket.emit("news-update", message);

//         // Update message as delivered to the user
//         await MessageModel.updateOne(
//           { _id: message._id },
//           { $set: { isDelivered: true } }
//         );

//         // Check if all users have received the message
//         const allDelivered = await MessageModel.countDocuments({
//           _id: message._id,
//           isDelivered: false,
//         });

//         if (allDelivered === 0) {
//           // Delete the message after all users have received it
//           await MessageModel.deleteOne({ _id: message._id });
//         }
//       });

//       // Remove user from OfflineUserModel after delivering the messages
//       await offlineUserModel.deleteOne({ userId });
//     } else {
//       // Track offline users and their messageIds
//       const offlineUser = await offlineUserModel.findOne({ userId });

//       if (offlineUser) {
//         // Add new messageIds to the offline user's record
//         const messageIds = offlineMessages.map((msg) => msg._id);
//         offlineUser.messageIds.push(...messageIds);
//         await offlineUser.save();
//       } else {
//         // Create a new record for offline users
//         await offlineUserModel.create({
//           userId,
//           messageIds: offlineMessages.map((msg) => msg._id),
//         });
//       }
//     }

//     // Handle disconnect
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });
// };

// export default socketService;
