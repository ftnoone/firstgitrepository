function DFS(G){
    let arr = new Array(G.n), i, time = 0, iterator, key;
    for(i = 0; i < G.n; i ++){
        arr[i] = {
            key: i,
            d: 0,
            f: 0,
            color: 0,//0代表未遍历，1代表正在对其子节点进行遍历，2代表对此节点以及其子节点完成遍历
            p: null
        };
    }
    function visit(u){
        time ++;
        arr[u].d = time;
        arr[u].color = 1;
        iterator = G.iterator(u);
        while(iterator.hasNext()){
            key = iterator.next();
            if(arr[key].color == 0){
                arr[key].p = arr[u];
                visit(key);
            }
        }
        arr[u].color = 2;
        time ++;
        arr[u].f = time;
    }
    arr[s].color = 1;
    arr[s].d = 0;
    for(let a of G){
        if(arr[a] == 0) visit(a);
    }
    return arr;
}
class linkedGraph{//无向简单图
    constructor(n){
        this.e = new Array(n);//边集
        for(let i = 0; i < n; i ++) this.e[i] = new doubleLinkedList();
        this.n = n;//顶点数
    }
    [Symbol.iterator]() {//对图的节点进行遍历
        let i = 0, n = this.n;
        return {
            next() {
                return {
                    value: i ++,
                    done: i > n
                };
            }
        };
    }
    member(a){
        return this.check(a);
    }
    check(a){
        return !((a >= this.n) || (a < 0));
    }
    insertE(a, b){
        if(this.check(a) && this.check(b) && !this.e[a].member(b)){
            this.e[a].insert(b);
            return true;
        }else return false;
    }
    deleteE(a, b){
        if(this.check(a) && this.check(b)){
            this.e[a].delete(b);
        }
    }
    showString(){
        for(let i = 0, len = this.n; i < len; i ++){
            console.log(`e[${i}]`);
            arr[i].showString();
        }
    }
    iterator(a){//下层是双循环链表，对上提供对顶点a的邻接链表的迭代器
        if(!this.check(a)) return null;
        let adj = this.e[a], door = adj.door, node = door, key, hasN = true;
        if(door == null) hasN = false;
        return {
            next(){
                key = node.key;
                node = adj.successorNode(node);
                hasN = node != door;
                return key;
            },
            hasNext(){
                return hasN;
            }
        }
    }
}
class listNode{
    constructor(key){
        this.key = key;
        this.left = null;
        this.right = null;
    }
}
class doubleLinkedList{//注意不可以对已经删除的节点再删除，和对插入的节点再插入，因为没有做节点是否在链表的判断
    constructor(){
        this.door = null;//链表入口
        //注意链表的结点需要有left和right属性，showString函数需要key值
    }
    successorNode(node){
        return node.right;
    }
    createNode(key){
        return new listNode(key);
    }
    member(key){
        if(this.door == null) return false;
        for(let a of this){
            if(a.key == key) return true;
        }
        return false;
    }
    insert(key){//往door的left处插入
        let node = this.createNode(key);
        if(this.door == null) {
            this.door = node;
            node.left = node;
            node.right = node;
        }else{
            this.#nodeInsert(node, this.door);
        }
    }
    delete(key){
        for(let a of this){
            if(a.key == key){
                this.#nodeDelete(a);
                return ;
            }
        }
    }
    #nodeDelete(node){
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
    #nodeInsert(x, y){//x插入y左边
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
        let door = this.door, node = door, ifEnd = false, obj;
        return {
            next() {
                obj = {
                    value: node,
                    done: ifEnd
                };
                if(node.right == door) ifEnd = true;
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
            str += a.key + " ⇋ ";
        }
        console.log(str);
    }
}
var {random, floor} = Math;