class disjointSet{//不相交集合，支持查找集合和合并集合操作
    constructor(data){
        this.p = this;
        this.data = data;
        this.rank = 0;
    }
    union(set){//按秩合并，让小的秩集合合并到大的秩的集合
        return this.findSet().link(set.findSet());
    }
    get(){
        return this.data;
    }
    link(set){//
        if(this.rank > set.rank){
            set.p = this;
            return this;
        }else {
            this.p = set;
            if(this.rank == set.rank){
                set.rank ++;
            }
            return set;
        }
    }
    findSet(){//路径压缩
        if(this.p != this){
            this.p = this.#findSetPathCompress(this.p)
        }
        return this.p;
    }
    #findSetPathCompress(set){
        if(set != set.p){
            set.p = this.#findSetPathCompress(set.p);
        }
        return set.p;
    }
}
class dynamicArray{//动态表，满时倍增空间
    constructor(n = 16){
        this.size = n > 16 ? n : 16;
        this.arr = new Array(this.size);
        this.length = 0;
    }
    check(i){
        return i >= 0 && i < this.size;
    }
    get(i){
        if(this.check(i)){
            return this.arr[i];
        }
        return null;
    }
    add(ele){
        if(this.isFull()){
            this.enlarge();
        }
        this.arr[this.length ++] = ele;
    }
    isFull(){
        return this.size == this.length;
    }
    enlarge(){
        let newArr = new Array(this.size * 2);
        for(let i = 0; i < this.size; i ++) newArr[i] = this.arr[i];
        this.arr = newArr;
        this.size *= 2;
    }
    reduce(){
        if(this.size <= 16) return;
        let limit = Math.floor(this.size/2), newArr = new Array(limit);
        for(let i = 0; i < limit; i ++) newArr[i] = this.arr[i];
        this.arr = newArr;
        this.size = limit;
    }
    sort(fun){
        this.arr.sort(fun);
    }
    [Symbol.iterator]() {//对图的节点进行遍历
        let i = 0, top = this.length, arr = this.arr;
        return {
            next() {
                return {
                    value: arr[i ++],
                    done: i > top
                };
            }
        };
    }
}
class stack{//栈
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
class linkedForestNode{//森林节点
    constructor(key, data){
        this.p = null;
        this.key = key;
        this.data = data;
        this.child = new doubleLinkedList();//孩子链表，放是linkedForestNode
    }
    insert(node){//插入森林节点
        if(node instanceof linkedForestNode){
            this.child.insert(node);
            node.p = this;
        }
    }
}
class linkedForest{//森林
    constructor(arr = null){
        this.arr = arr;
    }
    get(i){
        return this.arr[i];
    }
    setForest(arr){
        for(let a of arr){
            if(!(a instanceof linkedForestNode)) return false;
        }
        this.arr = arr;
        return true;
    }
    showString(){
        console.log(this.beString());
    }
    beString(){//森林深度优先遍历
        let arr = this.arr, s = new stack(arr.length), str = "", d, iterator, forestNode, indent, indentStep, ifLine = false;
        for(let i = 0; i < arr.length; i ++){
            //d表示层数，每次向下降一层加一，indent表示下一次添加字符需要几个\t
            if(arr[i].p == null){
                d = 0;
                indent = 1;
                if(ifLine) str += "\n";//是否换行
                str += `forest[${i}]: ` + arr[i].key;
                iterator = arr[i].child.valIterator();//子节点由双循环队列组成
                ifLine = false;//换行了下一行不换
                do{
                    while(iterator.hasNext()){
                        d ++;
                        forestNode = iterator.next();
                        if(ifLine) str += "\n";//换行
                        for(indentStep = 0; indentStep < indent; indentStep ++) str += "\t";//保持输出对齐
                        str += forestNode.key;
                        s.push(iterator);
                        iterator = forestNode.child.valIterator();
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
        return str;
    }
}
class graphTraverseResultNode extends linkedForestNode{//图深度优先遍历的结果数组元素
    constructor(index, info){
        super(index, info);
        this.d = 0;
        this.f = 0;
        this.color = 0;//0代表未遍历，1代表正在对其子节点进行遍历，2代表对此节点以及其子节点完成遍历
    }
}
class graphTraverseResult extends linkedForest{//图深度优先遍历的结果
    constructor(n, info){
        super();
        let arr = new Array(n);
        for(let i = 0; i < n; i ++) arr[i] = new graphTraverseResultNode(info[i], i);//链表树输出key值，所以将info放入key，索引放入data
        super.setForest(arr);
        this.n = n;
        this.traversed = false;
    }
    beTraversed(){
        this.traversed = true;
    }
    showString(){
        if(this.traversed) console.log(super.beString());
    }
}
class weightGraphNode{//带权图的邻接链表节点
    constructor(from, vertex, weight){
        this.from = from;
        this.vertex = vertex;
        this.weight = weight;
    }
}
class linkedGraph{//带权有向图
    constructor(n, info){
        this.e = new Array(n);//边集
        for(let i = 0; i < n; i ++) this.e[i] = new doubleLinkedList();
        this.n = n;//顶点数
        this.info = null;//顶点的名字
        this.edgeNum = 0;//边数
        this.edges = new dynamicArray();
        this.setInfo(info);
        this.dfsResult = null;
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
    dfs(){
        if(this.dfsResult != null) return this.dfsResult;
        let result = new graphTraverseResult(this.n, this.info), i, time = 0, iterator, parent, child, s = new stack(this.n), arr = result.arr;
        for(i = 0; i < this.n; i ++){
            if(arr[i].color == 0) {
                iterator = this.iterator(i);
                time ++;
                arr[i].d = time;
                arr[i].color = 1;
                parent = i;
                while(true){
                    while(iterator.hasNext()){
                        child = iterator.next();
                        if(arr[child].color == 0){
                            s.push(iterator);
                            time ++;
                            arr[child].d = time;
                            arr[child].color = 1;
                            arr[parent].insert(arr[child]);
                            iterator = this.iterator(child);
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
        this.dfsResult = result;
        result.traversed = true;
        return result;
    }
    dfsShow(){
        if(this.dfsResult != null) this.dfsResult.showString();
        else {
            this.dfs();
            this.dfsResult.showString();
        }
    }
    getEdges(){
        return this.edges;
    }
    setInfo(info){
        if(info instanceof Array){
            if(info.length >= this.n) this.info = info;
        }
    }
    memberVertex(a){
        return this.check(a);
    }
    check(a){
        return a >= 0 && a < this.n;
    }
    checkE(a, b){
        return this.check(a) && this.check(b) && !this.memberE(a, b);
    }
    memberE(a, b){
        if(this.check(a) && this.check(b)){
            let iterator = this.e[a].valIterator();
            while(iterator.hasNext()){
                if(iterator.next().vertex == b) return true;
            }
        }
        return false;
    }
    setWeight(a, b, w){
        if(this.check(a) && this.check(b)){
            let iterator = this.e[a].valIterator(), graphNode;
            while(iterator.hasNext()){
                graphNode = iterator.next();
                if(graphNode.vertex == b) {
                    graphNode.weight = w;
                    return true;
                }
            }
        }
        return false;
    }
    getWeight(a, b){
        if(this.check(a) && this.check(b)){
            let iterator = this.e[a].valIterator(), graphNode;
            while(iterator.hasNext()){
                graphNode = iterator.next();
                if(graphNode.vertex == b) {
                    return graphNode.weight;
                }
            }
        }
        return 0;
    }
    insertE(a, b, w = 1){
        if(this.check(a) && this.check(b) && !this.memberE(a, b)){
            let weightNode = new weightGraphNode(a, b, w);
            this.edges.add(weightNode);
            this.e[a].insert(weightNode);
            this.edgeNum ++;
            return true;
        }else return false;
    }
    insertWGN(wgn){
        if(wgn instanceof weightGraphNode){
            if(this.checkE(wgn.from, wgn.vertex)){
                this.edges.add(wgn);
                this.e[wgn.from].insert(wgn);
                this.edgeNum ++;
                return true;
            }
        }else return false;
    }
    deleteE(a, b){//注意这里没有实现边数组edges的删除
        if(this.check(a) && this.check(b)){//因为双循环队列的实现，使用直接删除节点很快。
            for(let listNode of this.e[a]){
                if(listNode.data.vertex == b) {
                    this.e[a].nodeDelete(listNode);
                    this.edgeNum --;
                    return true;
                }
            }
        }
        return false;
    }
    showString(){
        console.log(this.beString());
    }
    beString(){
        let str = "", iterator, graphNode;
        for(let i = 0, len = this.n; i < len; i ++){
            str += `[${i}]${this.getInfo(i)}: `;
            iterator = this.e[i].valIterator();
            while(iterator.hasNext()){
                graphNode = iterator.next();
                str += `→[${graphNode.vertex}]${this.getInfo(graphNode.vertex)}:${graphNode.weight} `;
            }
            str += "\n";
        }
        return str;
    }
    getInfo(a){
        if(this.info == null) return null;
        else return this.info[a];
    }
    iterator(a){//下层是双循环链表，对上提供对顶点a的邻接链表的迭代器，返回值是节点索引
        if(!this.check(a)) return null;
        let adj = this.e[a], door = adj.door, node = door, vertex, hasN = true;
        if(door == null) hasN = false;
        return {
            next(){
                vertex = node.data.vertex;//节点索引
                node = adj.successorNode(node);
                hasN = node != door;
                return vertex;
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
                return true;
            }
        }
        return false;
    }
    nodeDelete(node){
        let left = node.left, right = node.right;
        if(node == this.door) {
            if(node == right) {
                this.door = null;
                return node;
            }else this.door = right;
        }
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
    valIterator(){//值遍历器，[Symbol.iterator]是节点遍历器，使用节点遍历器对外暴露节点，方便使用nodeDelete删除节点，值遍历器适用于不是删除得操作
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
            return "null";
        }
        let str = '';
        for(let a of this){
            str += a.data + " ⇋ ";
        }
        return str;
    }
}
var {random, floor} = Math;
function testSet(){//人肉测试不想交集合的分解无向图连通分量
    let G = new linkedGraph(10, ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
    G.insertE(0,1);
    G.insertE(0,2);
    G.insertE(1,2);
    G.insertE(1,3);
    G.insertE(4,5);
    G.insertE(4,6);
    G.insertE(7,8);
    G.showString();
    let arr = connectedComponent(G);
    G.showString();
    return arr;
}
function connectedComponent(G){//根据图创建一个不相交集合
    let arr = new Array(G.n), i, iterator, key;
    for(i = 0; i < arr.length; i ++) arr[i] = new disjointSet(i);
    for(let u of G){
        iterator = G.iterator(u);
        while(iterator.hasNext()){
            key = iterator.next();
            if(arr[u].findSet() != arr[key].findSet()){
                arr[u].union(arr[key]);
            }
        }
    }
    return arr;
}
function sameComponent(arr, u, v){
    if(arr[u].findSet() == arr[v].findSet()) return true;
    return false;
}

function kruskal(G){//kruskal算法最小生成树，使用linkedGraph，参数为带权图
    let arr = new Array(G.n), i, edges = G.getEdges(), u, v, A = new dynamicArray();
    edges.sort((a, b)=>a.weight - b.weight);
    for(i = 0; i < arr.length; i ++) arr[i] = new disjointSet({vertex: i, info: G.getInfo(i)});
    for(let edge of edges){
        u = edge.from;
        v = edge.vertex;
        if(arr[u].findSet() != arr[v].findSet()){
            A.add(edge);
            arr[u].union(arr[v]);
        }
    }
    return {
        edges: A,
        root: arr[0].findSet().get().vertex
    };
}
function getWGN(...arg){//生成weightGraphNode节点
    return new weightGraphNode(...arg);
}
let time, key, arr;
function testMinimumSpanningTree(){
    let info = ["a", "b", "c", "d", "e", "f", "g", "h", "i"], G = new linkedGraph(9, info), i;
    //注意将linkedGraph当无向图用
    arr = [
        getWGN(0,1,4),
        getWGN(1,2,8),
        getWGN(2,3,7),
        getWGN(3,4,9),
        getWGN(4,5,10),
        getWGN(5,3,14),
        getWGN(5,2,4),
        getWGN(5,6,2),
        getWGN(6,7,1),
        getWGN(7,0,8),
        getWGN(7,1,11),
        getWGN(7,8,7),
        getWGN(8,2,2),
        getWGN(8,6,6)
    ]
    for(i = 0; i < arr.length; i ++) {
        G.insertWGN(arr[i]);
        G.insertE(arr[i].vertex, arr[i].from, arr[i].weight);
    }
    let {edges: A, root} = kruskal(G), t = new linkedGraph(9, info);
    for(let a of A) {
        t.insertWGN(a);
        t.insertE(a.vertex, a.from, a.weight);
    }
    let result = new graphTraverseResult(t.n, info);
    arr = result.arr;
    dfsVisit(t, root);
    result.beTraversed();
    result.showString();
}
testMinimumSpanningTree()
function dfsVisit(G, u){
    time ++;
    arr[u].d = time;
    arr[u].color = 1;
    let iterator = G.iterator(u);
    while(iterator.hasNext()){
        key = iterator.next();
        if(arr[key].color == 0){
            arr[u].insert(arr[key]);
            dfsVisit(G, key);
        }
    }
    arr[u].color = 2;
    time ++;
    arr[u].f = time;
}
function DFS(G){//递归dfs
    time = 0;
    let result = new graphTraverseResult(G.n, G.info);
    arr = result.arr;
    for(let a of G){
        if(arr[a].color == 0) dfsVisit(G, a);
    }
    result.traversed = true;
    return result;
}