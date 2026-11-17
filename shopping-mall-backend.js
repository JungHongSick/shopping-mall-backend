const express = require('express');
const oracledb = require('oracledb');

const app = express();

console.log('Express 로딩 성공');
console.log('OracleDB 로딩 성공');
console.log('OracleDB 버전:', oracledb.versionString);

app.listen(52273, function () {
    console.log('쇼핑몰 서버 시작!');
    console.log('http://localhost:52273');
});