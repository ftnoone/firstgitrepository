class vEBTree{
    constructor(u){
        this.n = getMaxBinaryBit(u);//默认为无符号整数，32位
        this.root = null;
    }
    buildTree(){
        let temp, digit = this.n;
        this.root = new vEBTreeNode(high(digit), low(digit));
        while(digit != 1){
        }
    }
    
}
var high = (digit)=>{//参数是全域u的位数
        return digit - (digit>>>1);
    }, 
    low = (digit)=>{
        return digit>>>1;
    };
class vEBTreeNode{
    constructor(high, low){
        if(low > 0) {
            this.summary = null;
            this.cluster = new Array(clusterSize);
        }
        this.u = 1<<(n + clusterSize);
        this.min = null;
        this.max = null;
    }
    createCluster(){

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
    constructor(){
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