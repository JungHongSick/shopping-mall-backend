const oracledb = require('oracledb');
const express = require('express')
const path = require("path");
const fs = require("fs/promises");
const app = express();

console.log('Express 로딩 성공');
console.log('OracleDB 로딩 성공');
console.log('OracleDB 버전:', oracledb.versionString);

app.get('/products', async function(req,res){
    try{
        const products = await ProductsConnection();
        res.json(products);
    }catch(error){
        res.status(500).json({
            message: "상품 조회에 실패했습니다."
        })
    }
})

async function ProductsConnection() {
    let productsconnection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, 'sql', 'queries.sql'),
            'utf8'
        )
            productsconnection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
            })
            console.log('DB 연결 성공');
            
            const result = await productsconnection.execute(
                sql.trim().replace(/;\s*$/, ''),
                [],
                { id:1 }
            );
            
            return result.rows;

        }catch(error){
                console.error('오류 발생:', error.message);
                throw error;
        }finally{
        if (productsconnection) {
            await productsconnection.close();
            console.log('DB 연결 종료');
        }
        }
}
    
app.listen(52273, function () {
    console.log('쇼핑몰 서버 시작!');
    console.log('http://localhost:52273');
});