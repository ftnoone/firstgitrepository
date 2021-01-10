var A = 0.6180339887, ceil = Math.ceil, floor = Math.floor;
//(Math.log2(5) - 1)/2
class hashTable{
    constructor(size, i = 0){
        this.m = 1 << (getMaxBinaryBit(size) - 1);
        this.table = this.createTable(this.m);
        this.other = null;
    }
    createTable(size){
        return new Array(size).fill(null);
    }
    init(i){
        switch(i){
            case 1: return function(val){
                return floor(((val*A) % 1) * this.m);
            }
            default: return function(val){
                return val % this.m;
            }
        }
    }
    setEle(i, ele){
        this.table[i] = ele;
    }
    getEle(i){
        return this.table[i];
    }
    hasEle(i){
        return this.table[i] == null;
    }
    deleteEle(i){
        this.table[i] = null;
    }
    get
    insert(val, ele){
        var hash = this.getHash(val);
        if(this.hasEle(hash)){
            return this.solveConflict(val, ele);
        }else this.setEle(hash, ele);
        return 0;
    }
    has(val){
        if(!this.hasEle(this.getHash(val))) {
            if(!this.hasOtherEle) return false;
        }
        return true;
    }
    get(val){
        var hash = this.getHash(val);
        if(this.hasEle(hash)){
            return this.getEle(hash);
        }
        return this.getOtherEle(val);
    }
    delete(val){
        var hash = this.getHash(val);
        if(this.hasEle(hash)){
            this.deleteEle(hash);
            return 0;
        }else return this.deleteOtherEle(val);
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