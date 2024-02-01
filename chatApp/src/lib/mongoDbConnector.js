const mongoose = require('mongoose');

export const initializeMongoDb = async () => {
    await mongoose.connect(
        `mongodb+srv://admin:admin1234@createinterview.kixrqny.mongodb.net/voicechat?retryWrites=true&w=majority`,
        { useUnifiedTopology: true }
    ).then(() => {
        console.log('connected mongo')
    });
};

