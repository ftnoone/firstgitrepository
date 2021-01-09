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
    insert(val, ele){
        var hash = this.getHash(val);
        this.table[hash] = new list(val, ele, this.table[hash]);
    }
    get(val){
        var hash = this.getHash(val);
        var node = this.table[hash];
        while(node != null && node.key != val){
            node = node.next;
        }
        if(node != null) return node.ele;
        return null;
    }
    has(val){
        var hash = this.getHash(val);
        var node = this.table[hash];
        while(node != null && node.key != val){
            node = node.next;
        }
        if(node != null) return true;
        return false;
    }
    delete(val){
        var hash = this.getHash(val);
        var node = this.table[hash], prev = null;
        while(node != null && node.key != val){
            prev = node;
            node = node.next;
        }
        if(node != null) {
            if(prev != null) prev.next = node.next;
            else this.table[hash] = node.next;
            return 0;
        }
        return -1;
    }
    show(){
        var str, node, j;
        for(let i = 0, len = this.m; i < len; i ++){
            str = i + ": ";
            node = this.table[i];
            j = 0;
            while(node != null){
                str += `[key: ${node.key}, ele: ${node.ele}] -> `;
                j ++;
                node = node.next;
            }
            console.log(str + "size: " + j);
        }
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