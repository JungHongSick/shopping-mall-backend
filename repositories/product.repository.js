const path = require("path");
const fs = require("fs/promises");
const {getConnection} = require('../config/db');

async function getProducts() {
    let connection;
    
        try{
            const sql = await fs.readFile(
            path.join(__dirname, '..', 'sql', 'queries.sql'),
            'utf8'
        )
            connection = await getConnection();

            const result = await connection.execute(
                sql.trim().replace(/;\s*$/, ''),
                []
            );
            return result.rows;

        }catch(error){
                console.error('오류 발생:', error.message);
                throw error;
        }finally{
        if (connection) {
            await connection.close();
            console.log('DB 연결 종료');
        }
        }
};

async function getDetailProducts(id) {
    let connection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, '..', 'sql', 'product-detail.sql'),
            'utf8'
        )
            connection = await getConnection();
            
            const result = await connection.execute(
                sql.trim().replace(/;\s*$/, ''),
                { id:id }
            );
            
            return result.rows;

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

async function insertProduct(product) {
    let connection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, '..', 'sql', 'product-insert.sql'),
            'utf8'
        )
            connection = await getConnection();
            
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

async function updateProduct(product, id) {
    let connection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, '..', 'sql', 'product-update.sql'),
            'utf8'
        )
            connection = await getConnection();
            
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

async function deleteProduct(id) {
    let connection;
        try{
            const sql = await fs.readFile(
            path.join(__dirname, '..', 'sql', 'product-delete.sql'),
            'utf8'
        )
            connection = await getConnection();
            
            const result = await connection.execute(
                sql.trim().replace(/;\s*$/, ''),
                {id: id},
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

module.exports = { getProducts, getDetailProducts, insertProduct, updateProduct, deleteProduct };
