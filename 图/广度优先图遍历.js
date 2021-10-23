function BFS(G, s){//基于队列存储节点信息
    let arr = new Array(G.n), q = new queue(G.n), i;
    for(i = 0; i < G.n; i ++){
        arr[i] = {
            key: i,
            color: 0,
            d: Infinity,
            p: null
        };
    }
    arr[s].color = 1;
    arr[s].d = 0;
    q.enqueue(s);
    let u, iterator, key;
    while(!q.isEmpty()){
        u = q.dequeue();
        iterator = G.iterator(u);
        while(iterator.hasNext()){
            key = iterator.next();
            if(arr[key].color == 0){
                arr[key].d = arr[u].d + 1;
                arr[key].p = arr[u];
                arr[key].color = 1;
                q.enqueue(key);
            }
        }
    }
    return arr;
}
class linkedGraph{//无向简单图
    constructor(n){
        this.e = new Array(n);//边集
        for(let i = 0; i < n; i ++) this.e[i] = new doubleLinkedList();
        this.n = n;//顶点数
    }
    check(a){
        return !(a >= this.n);
    }
    insertE(a, b){
        if(this.check(a) && this.check(b) && !this.e[a].member(b)){
            this.e[a].insert(b);
            this.e[b].insert(a);
            return true;
        }else return false;
    }
    deleteE(a, b){
        if(this.check(a) && this.check(b)){
            this.e[a].delete(b);
            this.e[b].delete(a);
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
class queue{
    constructor(size){
        if(size == undefined || size <= 1) throw new Error("参数不正确");
        this.q = new Array(size);
        this.head = 0;
        this.tail = 0;
        this.n = size;
    }
    enqueue(element){
        if(this.isFull()) throw new Error("队列已满");
        else{
            this.q[this.head] = element;
            this.head = (this.head + 1) % this.n;
        }
    }
    dequeue(){
        if(this.isEmpty()) throw new Error("空队列");
        else{
            var ele = this.q[this.tail];
            this.tail = (this.tail + 1) % this.n;
            return ele;
        }
    }
    isFull(){
        return (this.head + 1) % this.n == this.tail;
    }
    isEmpty(){
        return this.head == this.tail;
    }
    showString(){
        var str = "[", fun;
        if(this.head >= this.tail){
            fun = (i)=>{
                if(i >= this.tail && i < this.head){
                    return true;
                }else return false;
            }
        }else fun = (i)=>{
            if(i < this.head || i >= this.tail) return true;
            else return false;
        }
        for(let a = this.q, i = 0; i < this.n; i ++){
            if(fun(i)){
                str += a[i];
            }else str += "空";
            if(i + 1 != this.n) str += ", ";
        }
        console.log(str + "]");
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