var A = 0.6180339887, ceil = Math.ceil, floor = Math.floor, random = Math.random;
//(Math.log2(5) - 1)/2
class hashTable{    //开放地址法最好不要删除元素，如果需要删除元素建议用拉链法
    constructor(size){
        var num = 1 << (getMaxBinaryBit(size) - 1);
        this.m = num << (!!(num^size));
        this.table = this.createTable(this.m);
        this.m2 = floor(random()*this.m);
        this.eleNum = 0;
        this.deleteSign = -1;
    }
    getSize(){
        return this.m;
    }
    createTable(size){
        return new Array(size).fill(null);
    }
    // init(i){
    //     switch(i){
    //         case 1: return function(val){
    //             return floor(((val*A) % 1) * this.m);
    //         }
    //         default: return function(val){
    //             return val % this.m;
    //         }
    //     }
    // }
    setEle(i, ele){
        this.table[i] = ele;
    }
    getEle(i){
        return this.table[i];
    }
    hasEle(i){
        return this.table[i] != null && this.table[i] != this.deleteSign;
    }
    deleteEle(i){
        this.table[i] = this.deleteSign;
    }
    getHash(val, i = 0){
        return (val % this.m + i * ((val % this.m2) | 1)) % this.m;
    }
    insert(val, ele){
        if(this.isFull()) return -1;
        var hash = this.getHash(val), i = 1;
        while(this.hasEle(hash)){
            hash = this.getHash(val, i ++);
        }
        console.log("this is insert: ", i, hash);
        this.setEle(hash, new hashItem(val, ele));
        this.eleNum ++;
        return 0;
    }
    isFull(){
        return this.eleNum == this.m;
    }
    has(val){
        var hash = this.getHash(val), i = 1, node = this.getEle(hash);
        while(node != null && (node == this.deleteSign || node.key != val)) {
            hash = this.getHash(val, i ++);
            node = this.getEle(hash);
        }
        console.log("this is has: ", i, hash);
        if(node == null || node.key != val) return false;
        return true;
    }
    get(val){
        var hash = this.getHash(val), i = 1, node = this.getEle(hash);
        while(node != null && (node == this.deleteSign || node.key != val)) {
            hash = this.getHash(val, i ++);
            node = this.getEle(hash);
        }
        console.log("this is get: ", i, hash);
        if(node == null || node.key != val) return null;
        return node.ele;
    }
    delete(val){
        var hash = this.getHash(val), i = 1, node = this.getEle(hash);
        while(node != null && node.key != val) {
            hash = this.getHash(val, i ++);
            node = this.getEle(hash);
        }
        console.log("this is delete: ", i, hash);
        if(node == null || node.key != val) return -1;
        this.deleteEle(hash);
        return 0;
    }
}
function getMaxBinaryBit(num){
    var b32, b16, b8, b4, b2;
    num &= ~0;
    b32 = !!(num >>> 16);
    num >>>= b32 * 16;
    b16 = !!(num >>> 8);
    num >>>= b16 * 8;
    b8 = !!(num >>> 4);
    num >>>= b8 * 4;
    b4 = !!(num >>> 2);
    num >>>= b4 * 2;
    b2 = !!(num >>> 1);
    num >>>= b2 * 1;
    return b32*16 + b16*8 + b8*4 + b4*2 + b2*1 + num;
}
class hashItem{
    constructor(key, ele){
        this.key = key;
        this.ele = ele;
    }
}