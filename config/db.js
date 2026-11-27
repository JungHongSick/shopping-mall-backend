const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('DB 연결 성공');

        return connection;

    } catch (error) {
        console.error('오류 발생:', error.message);
        throw error;
    }
}

module.exports = {getConnection};