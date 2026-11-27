const productRepository = require('../repositories/product.repository');

async function getProducts(req, res){
        try{
        const products = await productRepository.getProducts();
            res.json(products);
    }catch(error){
        res.status(500).json({
            message: "상품 조회에 실패했습니다."
        })
    }
}

async function getDetailProducts(req, res) {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({
                message: "유효하지 않은 상품 번호입니다."
            });
        }
        const products = await productRepository.getDetailProducts(id);
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
};

async function insertProduct(req, res){
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
    const rowsAffected = await productRepository.insertProduct(req.body) 
    res.status(201).json({
        message: "상품 등록 성공",
        rowsAffected: rowsAffected
    });
    }catch(error){
        console.error('상품 등록 오류:', error.message);
        
        if(error.code === 'ORA-02291'){
            return res.status(400).json({
                message:"존재 하지 않은 상품 카테고리 입니다."
            })
        }

        res.status(500).json({
            message: "상품 등록에 실패했습니다."
        });   
    }
};

async function updateProduct(req, res){
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
    const result = await productRepository.updateProduct(req.body, id)
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

        if(error.code === 'ORA-02291'){
            return res.status(400).json({
                message:"존재 하지 않은 상품 카테고리 입니다."
            })
        }
     return res.status(500).json({
        message: "상품 갱신에 실패했습니다."
     })
    }
};

async function deleteProduct(req, res){
    try{
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
       return res.status(400).json({
            message: '유효하지 않은 상품 번호입니다.'
        })
    }
    const result = await productRepository.deleteProduct(id)

    if(result === 1){
        return res.status(200).json({
            message: '상품 삭제가 완료되었습니다.'
        })
    }if(result === 0){
        return res.status(404).json({
            message: '상품이 존재하지 않습니다.'
        })
    }
    throw new Error('예상하지 못한 상품 삭제 결과입니다.')
    }catch(error){
        console.error('상품 삭제 오류:', error.message);

        if(error.code === 'ORA-02292'){
            return res.status(409).json({
                message:"참조 중인 상품은 삭제할 수 없습니다."
            })
        }
        
     return res.status(500).json({
        message: "상품 삭제에 실패했습니다."
     })
    }
};


module.exports = { getProducts, getDetailProducts, insertProduct, updateProduct, deleteProduct };

