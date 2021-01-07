var ceil = Math.ceil, floor = Math.floor, shiftBit = 5, intBit = 32;
function getCeilNum(size){
    //return ceil(size / 32);
    return (size + intBit - 1) >> shiftBit;
}
function getFloorNum(size){
    //return floor(size / 32);
    return size >> shiftBit;
}
function getLowBit(key){
    //return key % intBit;
    return key & (intBit - 1);
}

class bitHashTable{
    constructor(size){
        let a = getCeilNum(size);
        this.size = a << shiftBit;
        this.bit = intBit;//表示一个数组的元素含有的bit
        this.arr = new Array(a).fill(0);
    }
    setKey(key){
        if(!this.checkKey(key)) return -1;
        var num = getFloorNum(key), bit = 1 << getLowBit(key);
        if((this.arr[num] & bit) == bit) return -1;
        this.arr[num] |= bit;
        return 0;
    }
    checkKey(key){
        if(typeof key != "number") return false;
        if(key <= this.size) return key - floor(key) == 0;
        return false;
    }
    hasKey(key){
        if(!this.checkKey(key)) return false;
        var num = getFloorNum(key), bit = 1 << getLowBit(key);
        if((this.arr[num] & bit) == bit) return true;
        return false;
    }
    deleteKey(key){
        if(!this.checkKey(key)) return -1;
        var num = getFloorNum(key), bit = 1 << getLowBit(key);
        if((this.arr[num] & bit) == bit) {
            this.arr[num] &= (~bit);
            return 0;
        }
        return -1;
    }
}