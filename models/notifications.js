const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  phoneNumber: String,
  title: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
