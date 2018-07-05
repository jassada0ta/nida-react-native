class ShopService{
    getProductById(products,productId){
        return products.filter(x=>x.id===productId).pop();
    }
}

const services = new ShopService();
export default services;