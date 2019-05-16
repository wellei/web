export function saveToLocall(id, key, value) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller);
    console.log(localStorage)
}
export function loadFromLocal(id, key, def) {
    let seller = window.localStorage.__seller__;
    // 判断本地存储__seller__是否存在
    if (!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    // 判断商家是否存在
    if (!seller) {
        return def;
    }
    let ret = seller[key]; 
    return ret || def;
}