const oracledb = require('oracledb');
const path = require("path");
const fs = require("fs/promises");

async function testConnection() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('Oracle DB 연결 성공!');
        const sql = await fs.readFile(
            path.join(__dirname, 'sql', 'test.sql'),
            'utf8'
        )

        const result = await connection.execute(
             sql.trim().replace(/;\s*$/, '')
        );

        console.log('SQL 실행 결과:', result.rows);

    } catch (error) {
        console.error('오류 발생:', error.message);
    } finally {
        if (connection) {
            await connection.close();
            console.log('DB 연결 종료');
        }
    }
}

testConnection();