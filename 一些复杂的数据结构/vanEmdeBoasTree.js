function getMaxBinaryBit(num){//返回num二进制形式的左边第一个1的从右往左的次序
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
var upHalf = (digit)=>{//返回除二向上取整，参数是全域u的位数，结果是位数的一半向上取整，有high(digit) + low(digit) = digit
    return digit - (digit>>>1);
}, 
downHalf = (digit)=>{//返回除二向下取整，参数是全域u的位数，结果是位数的一半向下取整
    return digit>>>1;
};
class vEBTree{
    constructor(u){
        this.n = getMaxBinaryBit(u);//默认为无符号整数，32位，这里取最高位的1的位数
        this.root = new vEBTreeNode(this.n);//创建veb树时传入全域的总位数，用前半位数分配cluster和summary，后半位数递归创建veb树
        this.data = null;
    }
    createDataArr(){
        this.data = new Array(1<<this.n);
    }
    minimum(){
        return this.#minimum(this.root);
    }
    maximum(){
        return this.#maximum(this.root);
    }
    #minimum(v){
        return v.min;
    }
    #maximum(v){
        return v.max;
    }
    #high(key, lowDigit){//取key二进制下的高半位段，向上取整
        return key >>> lowDigit;
    }
    #low(key, lowDigit){//取key的二进制下的低半位段，向下取整
        return key - ((key>>>lowDigit)<<lowDigit);
    }
    #index(high, low, lowDigit){//将高半位段和低半位段拼接
        return (high << lowDigit) + low;
    }
    member(key){
        return this.#member(this.root, key);
    }
    #member(v, key){
        if(key == v.min || key == v.max){
            return true;
        }else if(v.u == 2) return false;
        return this.#member(v.cluster[this.#high(key, v.lowDigit)], this.#low(key, v.lowDigit));
    }
    successor(key){
        return this.#successor(this.root, key);
    }
    #successor(v, key){
        if(v.u == 2){
            if(key == 0 && v.max == 1) return 1;
            else return null;
        }else if(v.min != null && v.min > key) return v.min;
        let high = this.#high(key, v.lowDigit), maxlow = v.cluster[high].max;
        if(maxlow != null && maxlow > this.#low(key, v.lowDigit)) return this.#index(high, this.#successor(v.cluster[high], this.#low(key, v.lowDigit)), v.lowDigit);
        else {
            let succCluster = this.#successor(v.summary, high);
            if(succCluster == null) return null;
            else return this.#index(succCluster, v.cluster[succCluster].min, v.lowDigit);
        }
    }
    predecessor(key){
        return this.#predecessor(this.root, key);
    }
    #predecessor(v, key){
        if(v.u == 2){
            if(key == 1 && v.min == 0) return 0;
            else return null;
        }else if(v.max != null && v.max < key) return v.max;
        let high = this.#high(key, v.lowDigit), minlow = v.cluster[high].min;
        if(minlow != null && minlow < this.#low(key, v.lowDigit)) return this.#index(high, this.#predecessor(v.cluster[high], this.#low(key, v.lowDigit)), v.lowDigit);
        else {
            let preCluster = this.#predecessor(v.summary, high);
            if(preCluster == null) {
                if(v.min != null && v.min < key) return v.min;
                else return null;
            }
            else return this.#index(preCluster, v.cluster[preCluster].max, v.lowDigit);
        }
    }
    #emptyInsert(v, key){
        v.min = key;
        v.max = key;
    }
    insert(key){
        this.#insert(this.root, key);
    }
    #insert(v, key){
        if(v.min == null) this.#emptyInsert(v, key);
        else {
            if(key < v.min) [v.min, key] = [key, v.min];
            if(v.u > 2){
                let high = this.#high(key, v.lowDigit), low = this.#low(key, v.lowDigit);
                if(v.cluster[high].min == null){
                    this.#insert(v.summary, high);
                    this.#emptyInsert(v.cluster[high], low);
                }else this.#insert(v.cluster[high], low);
            }
            if(key > v.max) v.max = key;
        }
    }
    #delete(v, key){
        if(v.min == v.max && v.min == key) {
            v.min = null;
            v.max = null;
        }else if(v.u == 2){
            if(key == 0) v.min = 1;
            else v.max = 0;
        }
    }
}

class vEBTreeNode{
    constructor(n){//参数high是u域的高
        let highDigit = upHalf(n), lowDigit = downHalf(n);
        this.lowDigit = lowDigit;
        this.u = 1<<n;//将位数转换为全域
        this.min = null;
        this.max = null;
        if(lowDigit > 0) {//还有至少一位低位数代表可以继续递归创建veb树
            let limit = 1<<highDigit;//这里是把位数变成所需的cluster结构分配数量
            this.summary = new vEBTreeNode(highDigit);
            this.cluster = new Array(limit);
            for(let i = 0; i < limit; i ++) this.cluster[i] = new vEBTreeNode(lowDigit);
        }
    }
}
class listNode{
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}
class doubleLinkedList{//注意不可以对已经删除的节点再删除，和对插入的节点再插入，因为没有做节点是否在链表的判断
    constructor(key){
        this.door = null;//链表入口
        //注意链表的结点需要有left和right属性，showString函数需要key值
    }
    createNode(data){
        return new listNode(data);
    }
    insert(node){//往door的left处插入
        if(this.door == null) {
            this.door = node;
            node.left = node;
            node.right = node;
        }else{
            this.nodeInsert(node, this.door);
        }
    }
    delete(node){
        let left = node.left, right = node.right;
        if(node == right) {
            this.door = null;
            return node;
        }
        if(node == this.door) this.door = right;
        left.right = right;
        right.left = left;
        return node;
    }
    nodeInsert(x, y){//x插入y左边
        x.left = y.left;
        x.right = y;
        y.left.right = x;
        y.left = x;
    }
    union(list){//合并两个循环链表
        if(this.door == null) {
            this.door = list.door;
        }
        else if(list.door == null) return;
        else{
            let rightPoint1 = list.door, rightPoint2 = this.door, leftPoint1 = rightPoint1.left, leftPoint2 = rightPoint2.left;
            rightPoint1.left = leftPoint2;
            leftPoint2.right = rightPoint1;
            rightPoint2.left = leftPoint1;
            leftPoint1.right = rightPoint2;
        }
    }
    [Symbol.iterator]() {//循环链表的迭代器，原先使用常量保存door，但是在fib堆中对使用链表迭代时，有删除操作，所以有可能删除door节点，造成door指针指向错误，无法结束迭代器出现死循环，所以需要将door改成动态获取到变化的door节点，然后需要在迭代器返回的对象中保存链表的地址引用，用来获取door节点
        let that = this, node = that.door, ifEnd = false, obj;
        return {
            next() {
                obj = {
                    value: node,
                    done: ifEnd
                };
                if(node == null) {
                    console.log(that);
                }
                if(node.right == that.door) ifEnd = true;
                node = node.right;
                return obj;
            }
        };
    }
    showString(){//将循环链表的键值用字符串输出到控制台
        if(this.door == null) {
            console.log("null");
            return;
        }
        let str = '';
        for(let a of this){
            str += a.data + " ⇋ ";
        }
        console.log(str);
    }
}
var {random, floor} = Math;
var arr, veb;
function test1(){
    let n = floor(random()*100), i, key, j;
    arr = new Array(n);
    veb = new vEBTree(n);
    for(i = 0, j = 0; i < n; i++){
        key = floor(random()*n);
        if(!veb.member(key)){
            arr[i] = key;
            veb.insert(key);
            j ++;
        }
    }
    arr.sort((a, b)=>a-b);
    for(i = 0; i < j - 1; i ++){
        if(!veb.member(arr[i]) || !veb.member(arr[i + 1])) {
            console.log(`member:${i} ${veb.member(arr[i])}, ${veb.member(arr[i + 1])}`);
            return false;
        }
        if(veb.successor(arr[i]) != arr[i + 1]) {
            console.log(`sucessor:${i} ${veb.successor(arr[i])}, ${arr[i + 1]}`);
            return false;
        }
        if(veb.predecessor(arr[i + 1] != arr[i])) {
            console.log(`predecessor:${i + 1} ${veb.predecessor(arr[i + 1])}, ${arr[i]}`);
            return false;
        }
    }
    return true;
}