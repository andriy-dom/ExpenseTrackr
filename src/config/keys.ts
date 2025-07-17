import 'dotenv/config';

export default {
    password: process.env.PASSWORD_DB,
    jwt: process.env.JWT_SECRET,
    mongoURL: process.env.MONGO_URL
}