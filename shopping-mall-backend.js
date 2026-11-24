const oracledb = require('oracledb');
const express = require('express')
const path = require("path");
const fs = require("fs/promises");
const app = express();
app.use(express.json())



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



app.get('/products/:id', async function(req, res) {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({
                message: "유효하지 않은 상품 번호입니다."
            });
        }
        const products = await ProductDetailConnection(id);
        if(products.length === 0){
            return res.status(404).json({
                message:"유효하지 않은 상품 조회입니다."
            })
        }
        res.json(products);

    } catch(error) {
        res.status(500).json({
            message: "상품 조회에 실패했습니다."
        });
    }
});



app.post('/products', async function(req, res){
    try{
    console.log('전달받은 데이터', req.body)

    if (!req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)) {
    return res.status(400).json({
        message: "유효하지 않은 요청 데이터입니다."
    });
    }

    if(!Number.isInteger(req.body.product_price) ||
        req.body.product_price < 0 ||
        req.body.product_price > 9999999999 

    ){
        return res.status(400).json({
            message: "유효하지 않은 가격입니다."
        })
    }
    
    if(typeof req.body.product_name !== 'string'||
        req.body.product_name.trim() === '' ||
        Buffer.byteLength(req.body.product_name, 'utf8') > 20
    ){
         return res.status(400).json({
            message: "유효하지 않은 이름입니다."
        })
    }

    if(!Number.isInteger(req.body.product_stock) ||
        req.body.product_stock < 0 ||
        req.body.product_stock > 99999 
       
    ){
         return res.status(400).json({
            message: "유효하지 않은 수량입니다."
        })
    }

    if(!Number.isInteger(req.body.categories_number) ||
        req.body.categories_number <= 0
    ){
        return res.status(400).json({
            message: "유효하지 않은 숫자입니다."
        })
    }
    const rowsAffected = await ProductInsertConnection(req.body) 
    res.status(201).json({
        message: "상품 등록 성공",
        rowsAffected: rowsAffected
    });
    }catch(error){
        console.error('상품 등록 오류:', error.message);
        
        if(error.code == 'ORA-02291'){
            return res.status(400).json({
                message:"존재 하지 않은 상품 카테고리 입니다."
            })
        }

        res.status(500).json({
            message: "상품 등록에 실패했습니다."
        });   
    }
});



app.put('/products/:id', async function(req, res){
    try{
    const id = Number(req.params.id);

    if(!req.body || typeof req.body !== 'object' ||
        Array.isArray(req.body)){
        return res.status(400).json({
            message: '유효하지 않은 상품 정보입니다.'
        });
    }
    if(!Number.isInteger(id) || id <= 0){
       return res.status(400).json({
            message: '유효하지 않은 상품 번호입니다.'
        })
    }if(typeof req.body.product_name != 'string'||
        req.body.product_name.trim() === ''||
        Buffer.byteLength(req.body.product_name, 'utf8') > 20){
        return res.status(400).json({
            message: "유효하지 않은 상품 이름입니다."
        })
    }if(!Number.isInteger(req.body.product_price) ||
        req.body.product_price < 0 ||
        req.body.product_price > 9999999999 
     ){
        return res.status(400).json({
            message: "유효하지 않은 가격입니다."
        })
     }if(!Number.isInteger(req.body.product_stock) ||
        req.body.product_stock < 0 ||
        req.body.product_stock > 99999){
            return res.status(400).json({
                message: "유효하지 않은 수량입니다."
            })
        }
        if(!Number.isInteger(req.body.categories_number) ||
        req.body.categories_number <= 0
    ){
        return res.status(400).json({
            message: "유효하지 않은 카테고리입니다."
        })
    }
    const result = await ProductUpdateConnection(req.body, id)
    if(result === 1){
        return res.status(200).json({
            message: '상품 갱신이 완료되었습니다.'
        })
    }if(result === 0){
        return res.status(404).json({
            message: '상품이 존재하지 않습니다.'
        })
    }
    throw new Error('예상하지 못한 상품 수정 결과입니다.')
    }catch(error){
        console.error('상품 수정 오류:', error.message);

        if(error.code == 'ORA-02291'){
            return res.status(400).json({
                message:"존재 하지 않은 상품 카테고리 입니다."
            })
        }
     return res.status(500).json({
        message: "상품 갱신에 실패했습니다."
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
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
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

async function ProductDetailConnection(id) {
    let ProductDetailConnection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, 'sql', 'product-detail.sql'),
            'utf8'
        )
            ProductDetailConnection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
            })
            console.log('DB 연결 성공');
            
            const result = await ProductDetailConnection.execute(
                sql.trim().replace(/;\s*$/, ''),
                { id:id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            
            return result.rows;

        }catch(error){
                console.error('오류 발생:', error.message);
                throw error;
        }finally{
        if (ProductDetailConnection) {
            await ProductDetailConnection.close();
            console.log('DB 연결 종료');
        }
        }
}

async function ProductInsertConnection(product) {
    let connection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, 'sql', 'product-insert.sql'),
            'utf8'
        )
            connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
            })
            console.log('DB 연결 성공');
            
            const result = await connection.execute(
                sql.trim().replace(/;\s*$/, ''),
                {PRONAME: product.product_name,
                 PROPRICE: product.product_price, 
                 PROSTOCK: product.product_stock, 
                 PROCATEID: product.categories_number},
                { autoCommit: true }
            );
            
            return result.rowsAffected;

        }catch(error){
                console.error('오류 발생:', error.message);
                throw error;
        }finally{
        if (connection) {
            await connection.close();
            console.log('DB 연결 종료');
        }
        }
}

async function ProductUpdateConnection(product, id) {
    let connection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, 'sql', 'product-update.sql'),
            'utf8'
        )
            connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
            })
            console.log('DB 연결 성공');
            
            const result = await connection.execute(
                sql.trim().replace(/;\s*$/, ''),
                {id: id,
                 PRONAME: product.product_name,
                 PROPRICE: product.product_price, 
                 PROSTOCK: product.product_stock, 
                 PROCATEID: product.categories_number},
                { autoCommit: true }
            );
            
            return result.rowsAffected;

        }catch(error){
                console.error('오류 발생:', error.message);
                throw error;
        }finally{
        if (connection) {
            await connection.close();
            console.log('DB 연결 종료');
        }
        }
}



    
app.listen(52273, function () {
    console.log('쇼핑몰 서버 시작!');
    console.log('http://localhost:52273');
});