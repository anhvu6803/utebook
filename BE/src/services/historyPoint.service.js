const HistoryPoint = require('../models/history_point.model');
const User = require('../models/user.model');
const Book = require('../models/book.model');
const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');

const historyPointService = {
    // Create a new history point record
    async createHistoryPoint(historyPointData) {
        try {
            const newHistoryPoint = new HistoryPoint(historyPointData);
            return await newHistoryPoint.save();
        } catch (error) {
            throw error;
        }
    },

    // Get all history points
    async getAllHistoryPoints() {
        try {
            return await HistoryPoint.find().sort({ time: -1 });
        } catch (error) {
            throw error;
        }
    },

    // Get all history points with user and book information
    async getAllHistoryPointsWithUserInfo() {
        try {
            // Lấy tất cả history points
            const historyPoints = await HistoryPoint.find().sort({ time: -1 });
            
            // Lấy danh sách user IDs, book IDs và transaction IDs
            const userIds = [...new Set(historyPoints.map(hp => hp.id_user))];
            const bookIds = [...new Set(historyPoints.filter(hp => hp.bookId).map(hp => hp.bookId))];
            const transactionIds = [...new Set(historyPoints.filter(hp => hp.transactionId).map(hp => hp.transactionId))];
            
            // Lấy thông tin users (chỉ lấy _id và username)
            const users = await User.find({ _id: { $in: userIds } }, '_id username fullname email numberPhone');
            const userMap = {};
            users.forEach(user => {
                userMap[user._id.toString()] = {
                    _id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                    numberPhone: user.numberPhone
                };
            });
            
            // Lấy thông tin books (chỉ lấy _id và bookname) nếu có bookIds
            let bookMap = {};
            if (bookIds.length > 0) {
                const books = await Book.find({ _id: { $in: bookIds } }, '_id bookname');
                books.forEach(book => {
                    bookMap[book._id.toString()] = {
                        _id: book._id,
                        title: book.bookname
                    };
                });
            }

            // Lấy thông tin transactions nếu có transactionIds
            let transactionMap = {};
            if (transactionIds.length > 0) {
                const transactions = await Transaction.find({ _id: { $in: transactionIds } });
                transactions.forEach(transaction => {
                    transactionMap[transaction._id.toString()] = {
                        _id: transaction._id,
                        typePackage: transaction.typePackage,
                        amount: transaction.amount,
                        status: transaction.status,
                        vnp_TransactionNo: transaction.vnp_TransactionNo,
                        vnp_BankCode: transaction.vnp_BankCode,
                        vnp_BankTranNo: transaction.vnp_BankTranNo,
                        vnp_CardType: transaction.vnp_CardType,
                        vnp_PayDate: transaction.vnp_PayDate,
                        vnp_ResponseCode: transaction.vnp_ResponseCode
                    };
                });
            }
            
            // Kết hợp thông tin
            const result = historyPoints.map(hp => {
                const hpObj = hp.toObject();
                hpObj.userInfo = userMap[hp.id_user.toString()] || null;
                
                // Kiểm tra và gán thông tin sách
                if (hp.bookId) {
                    const bookIdStr = hp.bookId.toString();
                    hpObj.bookInfo = bookMap[bookIdStr] || null;
                } else {
                    hpObj.bookInfo = null;
                }

                // Kiểm tra và gán thông tin transaction
                if (hp.transactionId) {
                    const transactionIdStr = hp.transactionId.toString();
                    hpObj.transactionInfo = transactionMap[transactionIdStr] || null;
                } else {
                    hpObj.transactionInfo = null;
                }
                
                // Sử dụng createdAt thay vì time cho thông tin thời gian
                if (hpObj.createdAt) {
                    hpObj.time = hpObj.createdAt;
                }
                
                return hpObj;
            });
            
            return result;
        } catch (error) {
            console.error('Error in getAllHistoryPointsWithUserInfo:', error);
            throw error;
        }
    },

    // Get history points by user ID
    async getHistoryPointsByUserId(userId) {
        try {
            return await HistoryPoint.find({ id_user: userId }).sort({ time: -1 });
        } catch (error) {
            throw error;
        }
    },

    // Get history points by user ID with user and book information
    async getHistoryPointsByUserIdWithUserInfo(userId) {
        try {
            // Lấy history points của user
            const historyPoints = await HistoryPoint.find({ id_user: userId }).sort({ time: -1 });
            
            // Lấy thông tin user (chỉ lấy _id và username)
            const user = await User.findById(userId, '_id username');
            if (!user) {
                throw new Error('User not found');
            }
            
            // Lấy danh sách book IDs
            const bookIds = [...new Set(historyPoints.filter(hp => hp.bookId).map(hp => hp.bookId))];
            
            // Lấy thông tin books (chỉ lấy _id và title)
            const books = await Book.find({ _id: { $in: bookIds } }, '_id bookname');
            const bookMap = {};
            books.forEach(book => {
                bookMap[book._id.toString()] = {
                    _id: book._id,
                    title: book.bookname
                };
            });
            
            // Kết hợp thông tin
            const result = historyPoints.map(hp => {
                const hpObj = hp.toObject();
                hpObj.userInfo = {
                    _id: user._id,
                    username: user.username
                };
                hpObj.bookInfo = hp.bookId ? (bookMap[hp.bookId.toString()] || null) : null;
                return hpObj;
            });
            
            return result;
        } catch (error) {
            console.error('Error in getHistoryPointsByUserIdWithUserInfo:', error);
            throw error;
        }
    },

    // Get history point by ID
    async getHistoryPointById(id) {
        try {
            return await HistoryPoint.findById(id);
        } catch (error) {
            throw error;
        }
    },

    // Get history point by ID with user and book information
    async getHistoryPointByIdWithUserInfo(id) {
        try {
            // Lấy history point
            const historyPoint = await HistoryPoint.findById(id);
            if (!historyPoint) {
                return null;
            }
            
            // Lấy thông tin user (chỉ lấy _id và username)
            const user = await User.findById(historyPoint.id_user, '_id username');
            
            // Lấy thông tin book nếu có (chỉ lấy _id và title)
            let book = null;
            if (historyPoint.bookId) {
                book = await Book.findById(historyPoint.bookId, '_id bookname');
                if (book) {
                    book = {
                        _id: book._id,
                        title: book.bookname
                    };
                }
            }
            
            // Kết hợp thông tin
            const result = historyPoint.toObject();
            result.userInfo = user ? {
                _id: user._id,
                username: user.username
            } : null;
            result.bookInfo = book;
            
            return result;
        } catch (error) {
            console.error('Error in getHistoryPointByIdWithUserInfo:', error);
            throw error;
        }
    },

    // Update history point by ID
    async updateHistoryPoint(id, updateData) {
        try {
            const updatedHistoryPoint = await HistoryPoint.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            return updatedHistoryPoint;
        } catch (error) {
            throw error;
        }
    },

    // Delete history point by ID
    async deleteHistoryPoint(id) {
        try {
            const deletedHistoryPoint = await HistoryPoint.findByIdAndDelete(id);
            return deletedHistoryPoint;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = historyPointService; 