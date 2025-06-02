const Notification = require('../models/notification.model');
const User = require('../models/user.model');

exports.createNotificationForAllUsers = async ({ type, title, content }) => {
  try {
    const users = await User.find({}, '_id');
    const userIds = users.map(user => user._id);

    const notification = new Notification({
      userId: userIds,
      type,
      title,
      content
    });

    const saved = await notification.save();
    return saved;
  } catch (error) {
    throw error;
  }
};

exports.createNotificationForMembers = async ({ type, title, content }) => {
  try {
    const members = await User.find({ isMember: true }, '_id');
    const memberIds = members.map(user => user._id);

    const notification = new Notification({
      userId: memberIds,
      type,
      title,
      content
    });

    const saved = await notification.save();
    return saved;
  } catch (error) {
    throw error;
  }
};

exports.getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.find({
      userId: userId // kiểm tra nếu userId nằm trong mảng
    }).sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    return notifications;
  } catch (error) {
    throw new Error('Lỗi khi lấy thông báo của người dùng: ' + error.message);
  }
};
exports.sendNotificationToUser = async ({ userId, type, title, content }) => {
  try {
    const notification = new Notification({
      userId: [userId], // phải là mảng vì schema yêu cầu
      type,
      title,
      content
    });

    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    throw new Error('Không thể gửi thông báo: ' + error.message);
  }
};