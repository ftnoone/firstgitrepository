var A = (Math.log2(5) - 1)/2, ceil = Math.ceil, floor = Math.floor;
class hashTable{
    constructor(size, i = 0){
        this.m = size;
        this.table = this.createTable(size);
        this.getHash = this.init(i);
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
    solveConflict(val, ele){
        this.other = new list(val, ele, this.other);
    }
    getOtherEle(val){
        var node = this.other;
        while(node != null && node.key != val){
            node = node.getNext();
        }
        if(node != null) return node.ele;
        else return null;
    }
    hasOtherEle(val){
        if(this.getOtherEle(val) == null) return false;
        return true;
    }
    deleteOtherEle(val){
        var node = this.other, prev = null;
        while(node != null && node.key != val){
            prev = node;
            node = node.getNext();
        }
        if(node != null) {
            if(prev != null) prev.next = node.next;
            else this.other = node.next;
            return 0;
        }
        return -1;
    }
}
class list{
    constructor(key, ele, next){
        this.key = key;
        this.ele = ele;
        this.next = next;
    }
    setNext(p){
        this.next = p;
    }
    getNext(){
        return this.next;
    }
}