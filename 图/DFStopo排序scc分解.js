function print(arr){//打印dfs返回的数组结果，打印的
    var s = new stack(arr.length), str = "";
    for(let i = 0, d, iterator, arrEle, indent, indentStep, ifLine = false; i < arr.length; i ++){
        //d表示层数，每次向下降一层加一，indent表示下一次添加字符需要几个\t
        if(arr[i].p == null){
            d = 0;
            indent = 1;
            if(ifLine) str += "\n";//是否换行
            str += `arr[${i}]: ` + arr[i].key;
            iterator = arr[i].child.iterator();//子节点由双循环队列组成
            ifLine = false;//换行了下一行不换
            do{
                while(iterator.hasNext()){
                    d ++;
                    arrEle = iterator.next();
                    if(ifLine) str += "\n";//换行
                    for(indentStep = 0; indentStep < indent; indentStep ++) str += "\t";//保持输出对齐
                    str += arrEle.key;
                    s.push(iterator);
                    iterator = arrEle.child.iterator();
                    indent = 1;//重置缩进的制表符
                    ifLine = false;//重置换行
                }
                ifLine = true;//开始回溯，所以换行输出结果
                indent = d + 1;//arr[i]占一个制表符，所以换行后的制表符多一
                d --;
                if(s.isEmpty()) break;
                else iterator = s.pop();
            }while(true)
        }
    }
    console.log(str);
}
let time, key, arr;
function dfsVisit(G, u){
    time ++;
    arr[u].d = time;
    arr[u].color = 1;
    let iterator = G.iterator(u);
    while(iterator.hasNext()){
        key = iterator.next();
        if(arr[key].color == 0){
            arr[key].p = arr[u];
            arr[u].child.insert(arr[key]);
            dfsVisit(G, key);
        }
    }
    arr[u].color = 2;
    time ++;
    arr[u].f = time;
}
function DFS(G){//递归dfs
    let i;
    time = 0;
    arr = new Array(G.n);
    for(i = 0; i < G.n; i ++){
        arr[i] = {
            p: null,
            d: 0,
            f: 0,
            color: 0,//0代表未遍历，1代表正在对其子节点进行遍历，2代表对此节点以及其子节点完成遍历
            key: testInfo[i],
            child: new doubleLinkedList()
        };
    }
    for(let a of G){
        if(arr[a].color == 0) dfsVisit(G, a);
    }
    return arr;
}
function stackDFS(G){//栈dfs
    let arr = new Array(G.n), i, time = 0, iterator, parent, child, s = new stack(G.n);
    for(i = 0; i < G.n; i ++){
        arr[i] = new arrNode(G.getInfo(i), i);
    }
    for(let u of G){
        if(arr[u].color == 0) {
            iterator = G.iterator(u);
            time ++;
            arr[u].d = time;
            arr[u].color = 1;
            parent = u;
            while(true){
                while(iterator.hasNext()){
                    child = iterator.next();
                    if(arr[child].color == 0){
                        s.push(iterator);
                        time ++;
                        arr[child].d = time;
                        arr[child].color = 1;
                        arr[child].p = arr[parent];
                        arr[parent].child.insert(arr[child]);
                        iterator = G.iterator(child);
                        parent = child;
                        continue;
                    }
                }
                arr[parent].color = 2;
                time ++;
                arr[parent].f = time;
                if(!s.isEmpty()){
                    iterator = s.pop();
                    parent = iterator.key;
                }else break;
            }
        }
    }
    return arr;
}
class stack{
    constructor(size){
        if(size == undefined || size <= 0) throw new Error("请输入正确的参数");
        this.s = new Array(size);
        this.n = size;
        this.top = 0;
    }
    pop(){
        if(this.isEmpty()) return null;
        else return this.s[-- this.top];
    }
    push(element){
        if(!this.isFull()){
            this.s[this.top ++] = element;
            return true;
        }else return false;
    }
    isEmpty(){
        return this.top == 0;
    }
    isFull(){
        return this.top == this.n;
    }
}
class linkedGraph{//有向图
    constructor(n, info){
        this.e = new Array(n);//边集
        for(let i = 0; i < n; i ++) this.e[i] = new doubleLinkedList();
        this.n = n;//顶点数
        this.info = null;
        this.changeInfo(info);
    }
    changeInfo(info){
        if(info instanceof Array){
            if(info.length >= this.n) this.info = info;
        }
    }
    getInfo(a){
        if(this.info == null) return null;
        else return this.info[a];
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
        console.log(this.beString());
    }
    beString(){
        let str = "";
        for(let i = 0, len = this.n; i < len; i ++){
            str += `[${i}] ${this.getInfo(i)}: ` + this.e[i].beString() + "\n";
        }
        return str;
    }
    iterator(a){//下层是双循环链表，对上提供对顶点a的邻接链表的迭代器，返回值是节点索引
        if(!this.check(a)) return null;
        let adj = this.e[a], door = adj.door, node = door, data, hasN = true;
        if(door == null) hasN = false;
        return {
            next(){
                data = node.data;
                node = adj.successorNode(node);
                hasN = node != door;
                return data;
            },
            hasNext(){
                return hasN;
            },
            key: a
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
    constructor(){
        this.door = null;//链表入口
        //注意链表的结点需要有left和right属性，showString函数需要key值
    }
    isEmpty(){
        return this.door == null;
    }
    successorNode(node){
        return node.right;
    }
    createNode(data){
        return new listNode(data);
    }
    member(data){
        if(this.door == null) return false;
        for(let a of this){
            if(a.data == data) return true;
        }
        return false;
    }
    insert(data){//往door的left处插入
        let node = this.createNode(data);
        if(this.door == null) {
            this.door = node;
            node.left = node;
            node.right = node;
        }else{
            this.nodeInsert(node, this.door);
        }
    }
    delete(data){
        for(let a of this){
            if(a.data == data){
                this.nodeDelete(a);
                return ;
            }
        }
    }
    nodeDelete(node){
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
    iterator(){
        let door = this.door, node = door, ifEnd = this.isEmpty(), val;
        return {
            next() {
                val = node.data;
                if(node.right == door) ifEnd = true;
                node = node.right;
                return val;
            },
            hasNext(){
                return !ifEnd;
            }
        };
    }
    showString(){//将循环链表的键值用字符串输出到控制台
        console.log(this.beString());
    }
    beString(){
        if(this.isEmpty()) {
            console.log("null");
            return;
        }
        let str = '';
        for(let a of this){
            str += a.data + " ⇋ ";
        }
        return str;
    }
}
var {random, floor} = Math;
function topologicalOrder(){//拓扑排序，深度优先搜索，然后将每颗深度优先树的根节点进行排序，将完成时间最晚的放在前面
    var a = new linkedGraph(9);//书上一个有向无环图的输入
    a.insertE(0,4);
    a.insertE(4,5);
    a.insertE(0,2);
    a.insertE(2,5);
    a.insertE(3,6);
    a.insertE(6,2);
    a.insertE(3,7);
    a.insertE(6,7);
    a.insertE(8,7);
    var testInfo = ["村衣", "手表", "腰带", "内裤", "领带", "夹克", "裤子", "鞋", "袜子"];
    var arr = stackDFS(a, testInfo);
    print(arr);
    arr.sort((a, b)=>{
        if(a.p == null && b.p == null) return b.f - a.f;
        else return 0;
    });
    print(arr);
}
class arrNode{//深度优先遍历的结果数组元素
    constructor(key, index){
        this.p = null;
        this.d = 0;
        this.f = 0;
        this.color = 0;//0代表未遍历，1代表正在对其子节点进行遍历，2代表对此节点以及其子节点完成遍历
        this.key = key;
        this.child = new doubleLinkedList();
        this.index = index;
    }
}

function scc(){//strongly connected component，强连通分量，函数将有向图分解为强连通分量
    let info = ["c", "g", "f", "h", "d", "b", "e", "a"];
    let a = new linkedGraph(8, info);//书上一个有向图的输入
    a.insertE(0,1);
    a.insertE(1,2);
    a.insertE(2,1);
    a.insertE(1,3);
    a.insertE(3,3);
    a.insertE(0,4);
    a.insertE(4,0);
    a.insertE(5,6);
    a.insertE(6,7);
    a.insertE(7,5);
    a.insertE(4,3);
    a.insertE(5,2);
    a.insertE(6,2);
    a.insertE(5,0);
    a.showString();
    let at = transpose(a);
    at.showString();
    let result = stackDFS(a), i;
    result.sort((a, b)=>b.f - a.f);
    time = 0;//全局变量初始化
    arr = new Array(at.n);//同上
    for(i = 0; i < at.n; i ++){
        arr[i] = new arrNode(info[i], i);
    }
    for(let a of result){
        if(arr[a.index].color == 0) dfsVisit(at, a.index);
    }
    print(arr);
}
scc();
function transpose(G){//获得转置图，G中有边(u, v)，则在转置图Gt中存在边(v, u)
    let iterator, key, Gt = new linkedGraph(G.n);
    for(let a of G){
        iterator = G.iterator(a);
        while(iterator.hasNext()){
            key = iterator.next();
            Gt.insertE(key, a);
        }
    }
    return Gt;
}