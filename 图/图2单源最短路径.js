
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
class dynamicArray{//动态表，满时倍增空间，length存放元素数量，size是实际空间的大小，注意没有实现表元素过少时释放空间
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
    enlarge(){//倍增
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
    [Symbol.iterator]() {//遍历动态表中的元素
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
            return true;
        }
        return false;
    }
    setP(node){
        if(node instanceof linkedForestNode){
            this.p = node;
        }
    }
}
class linkedForest{//森林，有向图
    constructor(arr = null){
        this.arr = arr;//一个linkedforestnode的数组
    }
    get(i){//返回linkedforestnode节点
        return this.arr[i];
    }
    getArr(){//返回内部的数组数据
        return this.arr;
    }
    setForest(arr){//设置内部的linkedforestnode数组
        for(let a of arr){
            if(!(a instanceof linkedForestNode)) return false;
        }
        this.arr = arr;
        return true;
    }
    noChildTrim(){//针对单源最短路径先求出父节点，再整理添加到森林的子节点列表中
        let p;
        for(let a of this.arr){
            if((p = a.p) != null){
                if(!(p.child.member(a))){
                    p.insert(a);
                }
            }
        }
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
                str += `t[${i}]: \t` + arr[i].key;
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
        this.changed = false;
        this.map = new Array(n);
    }
    get(i){
        if(this.changed){
            return this.arr[this.map[i]];
        }else return this.arr[i];
    }
    [Symbol.iterator]() {//对图的节点进行遍历，当添加删除操作时，注意遍历器的实现
        let i = 0, n = this.n, arr = this.arr;
        return {
            next() {
                return {
                    value: arr[i ++],
                    done: i > n
                };
            }
        };
    }
    setChanged(bool){//表示这是被遍历过后的结果，可以输出
        this.changed = !!bool;
    }
    showString(){
        console.log(super.beString());
    }
    customString(fun){//森林深度优先遍历
        let arr = this.arr, s = new stack(arr.length), str = "", d, iterator, forestNode, indent, indentStep, ifLine = false;
        for(let i = 0; i < arr.length; i ++){
            //d表示层数，每次向下降一层加一，indent表示下一次添加字符需要几个\t
            if(arr[i].p == null){
                d = 0;
                indent = 1;
                if(ifLine) str += "\n";//是否换行
                str += `t[${i}]: \t` + fun(arr[i]);
                iterator = arr[i].child.valIterator();//子节点由双循环队列组成
                ifLine = false;//换行了下一行不换
                do{
                    while(iterator.hasNext()){
                        d ++;
                        forestNode = iterator.next();
                        if(ifLine) str += "\n";//换行
                        for(indentStep = 0; indentStep < indent; indentStep ++) str += "\t";//保持输出对齐
                        str += fun(forestNode);
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
class weightGraphNode{//带权图的邻接链表节点，from出发边，vertex目的边，weight权重
    constructor(from, vertex, weight){
        this.from = from;
        this.vertex = vertex;
        this.weight = weight;
    }
}
function exchange(arr, a, b){
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
class linkedGraph{//带权有向图
    //无向图用linkedGraph实现需插入(u,v),(v,u)两个有向边，因为dfs遍历的实现会创建新的数据结构存放图的顶点，并会对遍历过的值做标记，所以重复插入对dfs遍历没有影响
    constructor(n, info){
        this.e = new Array(n);//边集
        for(let i = 0; i < n; i ++) this.e[i] = new doubleLinkedList();
        this.n = n;//顶点数
        this.info = null;//顶点的名字
        this.edgeNum = 0;//边数
        this.edges = new dynamicArray();
        this.setInfo(info);
    }
    [Symbol.iterator]() {//对图的节点进行遍历，当添加删除操作时，注意遍历器的实现
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
    topoSort(){
        let result = new graphTraverseResult(this.n, this.info), i, time = 0, iterator, parent, child, s = new stack(this.n), arr = result.arr;
        for(i = 0; i < this.n; i ++){
            if(arr[i].color == 0) {
                iterator = this.indexIterator(i);
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
                            arr[child].setP(arr[parent]);
                            iterator = this.indexIterator(child);
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
        arr.sort((a, b)=>b.f - a.f);
        for(i = 0; i < arr.length; i ++){
            result.map[arr[i].data] = i;
        }
        result.setChanged(true);
        return result;
    }
    dfs(){//dfs遍历后，会生成当前图的遍历结果并保存，当图改变时需要遍历则需要调用cleardfs清理结果
        let result = new graphTraverseResult(this.n, this.info), i, time = 0, iterator, parent, child, s = new stack(this.n), arr = result.arr;
        for(i = 0; i < this.n; i ++){
            if(arr[i].color == 0) {
                iterator = this.indexIterator(i);
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
                            iterator = this.indexIterator(child);
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
        return result;
    }
    dfsShow(){//展示dfs后的结果
        if(this.dfsResult != null) this.dfsResult.showString();
        else {
            this.dfs();
            this.dfsResult.showString();
        }
    }
    getEdges(){//获得边集，一个weightgraphnode的数组
        return this.edges;
    }
    setInfo(info){//设置节点信息，位置和索引一一对应
        if(info instanceof Array){
            if(info.length >= this.n) this.info = info;
        }
    }
    memberVertex(a){//是否存在节点
        return this.check(a);
    }
    check(a){//a是否在节点索引范围内
        return a >= 0 && a < this.n;
    }
    memberE(a, b){//是否存在边（a，b）
        if(this.check(a) && this.check(b)){
            let iterator = this.e[a].valIterator();
            while(iterator.hasNext()){
                if(iterator.next().vertex == b) return true;
            }
        }
        return false;
    }
    setWeight(a, b, w){//设置edge(a, b)的权重
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
    getWeight(a, b){//获得edge(a, b)的权重，不存在边返回权重0
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
    insertE(a, b, w = 1){//插入边，需要先检查不存在这个边防止重复插入
        if(!this.memberE(a, b)){
            let weightNode = new weightGraphNode(a, b, w);
            this.edges.add(weightNode);
            this.e[a].insert(weightNode);
            this.edgeNum ++;
            return true;
        }else return false;
    }
    insertWGN(wgn){//插入weightgraphnode带权节点，需要先检查不存在这个边防止重复插入
        if(wgn instanceof weightGraphNode){
            if(!this.memberE(wgn.from, wgn.vertex)){
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
    showString(){//展示邻接链表
        console.log(this.beString());
    }
    beString(){
        let str = "", iterator, graphNode;
        for(let i = 0, len = this.n; i < len; i ++){
            str += `[${i}]${this.getIndexInfo(i)}: `;
            iterator = this.e[i].valIterator();
            while(iterator.hasNext()){
                graphNode = iterator.next();
                str += `→[${graphNode.vertex}]${this.getIndexInfo(graphNode.vertex)}:${graphNode.weight} `;
            }
            str += "\n";
        }
        return str;
    }
    getIndexInfo(a){//返回indo数组
        if(this.info == null) return null;
        else return this.info[a];
    }
    getInfo(){
        return this.info;
    }
    indexIterator(a){//下层是双循环链表，对上提供对顶点a的邻接链表的迭代器，返回值是节点索引
        if(!this.check(a)) return null;
        let adj = this.e[a], node = adj.door, vertex, hasN = adj.door != null;
        return {
            next(){
                vertex = node.data.vertex;//节点索引
                node = adj.successorNode(node);
                hasN = node != adj.door;
                return vertex;
            },
            hasNext(){
                return hasN;
            },
            key: a
        }
    }
    wgnIterator(a){//下层是双循环链表，对上提供对顶点a的邻接链表的迭代器，返回值是带权图节点，weightgraphnode
        if(!this.check(a)) return null;
        let adj = this.e[a], node = adj.door, wgn, hasN = adj.door != null;
        return {
            next(){
                wgn = node.data;//节点索引
                node = adj.successorNode(node);
                hasN = node != adj.door;
                return wgn;
            },
            hasNext(){
                return hasN;
            },
            key: a
        }
    }
}
class listNode{//链表的节点
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
    getData(){
        return this.data;
    }
}
class doubleLinkedList{//注意不可以对已经删除的节点再删除，和对插入的节点再插入，因为没有做节点是否在链表的判断，上层自己实现
    constructor(){
        this.door = null;//链表入口
        this.n = 0;
        //注意链表的结点需要有left和right属性，showString函数需要key值
    }
    isEmpty(){
        return this.door == null;
    }
    successorNode(node){//提供方便节点的迭代，注意以下参数node是listnode链表节点，data参数是插入listnode链表节点的数据
        return node.right;
    }
    createNode(data){//提供创建一个链表节点
        return new listNode(data);
    }
    member(data){
        if(this.door == null) return false;
        for(let a of this){
            if(a.data == data) return true;
        }
        return false;
    }
    insert(data){//往door的left处插入，插入数据
        let node = this.createNode(data);
        this.nodeInsert(node);
    }
    nodeInsert(node){//插入节点
        if(!(node instanceof listNode)) return false;
        if(this.door == null) {
            this.door = node;
            node.left = node;
            node.right = node;
            this.n = 1;
        }else{
            this.customInsert(node, this.door);
        }
        return true;
    }
    delete(data){//这里需要遍历找到符合data的节点再删除,O(链表节点数))
        for(let a of this){
            if(a.data == data){
                this.nodeDelete(a);
                return true;
            }
        }
        return false;
    }
    nodeDelete(node){//提供对节点的删除，O(1)
        if(!(node instanceof listNode)) throw new Error("pleasedeletelistnode");
        let left = node.left, right = node.right;
        if(node == this.door) {
            if(node == right) {
                this.door = null;
                this.n = 0;
                return node;
            }else this.door = right;
        }
        left.right = right;
        right.left = left;
        this.n --;
        return node;
    }
    customInsert(x, y){//x插入y左边，插入的是listnode类
        x.left = y.left;
        x.right = y;
        y.left.right = x;
        y.left = x;
        this.n ++;
    }
    union(list){//合并两个循环链表
        if(this.door == null) {
            this.door = list.door;
            this.n = list.n;
        }
        else if(list.door == null) return;
        else{
            let rightPoint1 = list.door, rightPoint2 = this.door, leftPoint1 = rightPoint1.left, leftPoint2 = rightPoint2.left;
            rightPoint1.left = leftPoint2;
            leftPoint2.right = rightPoint1;
            rightPoint2.left = leftPoint1;
            leftPoint1.right = rightPoint2;
            this.n += list.n;
        }
    }
    [Symbol.iterator]() {//循环链表的迭代器，原先使用常量保存door，但是在fib堆中对使用链表迭代时，有删除操作，所以有可能删除door节点，造成door指针指向错误，无法结束迭代器出现死循环，所以需要将door改成动态获取到变化的door节点，然后需要在迭代器返回的对象中保存链表的地址引用，用来获取door节点
        let node = this.door, ifEnd = this.door == null, obj, that = this;
        return {
            next() {
                obj = {
                    value: node,
                    done: ifEnd
                };
                if(node.right == that.door) ifEnd = true;
                node = node.right;
                return obj;
            }
        };
    }
    valIterator(){//值遍历器，[Symbol.iterator]是节点遍历器，使用节点遍历器对外暴露节点，方便使用nodeDelete删除节点，值遍历器适用于不是删除的操作
        let node = this.door, ifEnd = this.door == null, that = this, val;
        return {
            next() {
                val = node.data;
                if(node.right == that.door) ifEnd = true;
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
            str += a.key + " ⇋ ";
        }
        return str;
    }
    beStringByData(handle){
        if(this.isEmpty()) {
            return "null";
        }
        let str = '';
        for(let a of this){
            str += handle(data) + " ⇋ ";
        }
        return str;
    }
    showStringByData(handle){
        console.log(this.beStringByData(handle));
    }
}
function initializeSingleSource(G){
    let arr = new graphTraverseResult(G.n, G.getInfo());
    for(let node of arr){
        node.d = Infinity;
    }
    return arr;
}
function relax(u, v, weight){
    if(v.d > u.d + weight){
        v.d = u.d + weight;
        v.setP(u);
    }
}
function bigRelax(u, v, weight){
    if(v.d < u.d + weight){
        v.d = u.d + weight;
        v.setP(u);
    }
}
function bellmanFord(G, sourceVertex, result) {
    let i, borderLen = G.n - 1, edges = G.getEdges(), edge;
    result = initializeSingleSource(G);
    A = result;
    result.get(sourceVertex).d = 0;
    for(i = 0; i < borderLen; i ++){
        for(edge of edges){
            relax(result.get(edge.from), result.get(edge.vertex), edge.weight);
        }
    }
    let u, v;
    result.noChildTrim();
    for(edge of edges){
        u = result.get(edge.from);
        v = result.get(edge.vertex);
        if(v.d > u.d + edge.weight){
            return false;
        }
    }
    return true;
}
function getWGN(...arg){//生成weightGraphNode节点
    return new weightGraphNode(...arg);
}
let time, arr, A;
function testBellmanFord(){//对书上一个图测试BellmanFord单源最短路径算法
    let info = ["s", "t", "x", "z", "y"], G = new linkedGraph(5, info), i;
    arr = [
        getWGN(0,1,6),
        getWGN(1,2,5),
        getWGN(2,1,-2),
        getWGN(1,3,-4),
        getWGN(1,4,8),
        getWGN(3,2,7),
        getWGN(3,0,2),
        getWGN(4,2,-3),
        getWGN(4,3,9),
        getWGN(0,4,7)
    ];
    for(i = 0; i < arr.length; i ++) {
        G.insertWGN(arr[i]);
    }
    if(bellmanFord(G, 0, A)) console.log(A.customString(customHandleFunForBellmanFord));
    else console.log("?")
}
function customHandleFunForBellmanFord(forestNode){
    if(forestNode instanceof graphTraverseResultNode){
        return `${forestNode.key}:${forestNode.d}`;
    }
}
function topologicalDAGShortestPaths(G, s){//directed acyclic graph，计算有向无环图单源最短路径
    let iterator, wgn;
    result = G.topoSort();
    for(let node of result){
        node.d = Infinity;
    }
    result.get(s).d = 0;
    for(let node of result){
        iterator = G.wgnIterator(node.data);
        while(iterator.hasNext()){
            wgn = iterator.next();
            relax(node, result.get(wgn.vertex), wgn.weight);
        }
    }
    result.noChildTrim();
    return result;
}
function testTopoDagShortestPaths(){
    let info = ["s", "t", "x", "y", "z", "r"], G = new linkedGraph(6, info), i;
    arr = [
        getWGN(0,1,2),
        getWGN(0,2,6),
        getWGN(1,2,7),
        getWGN(1,3,4),
        getWGN(1,4,2),
        getWGN(2,3,-1),
        getWGN(2,4,1),
        getWGN(3,4,-2),
        getWGN(5,0,5),
        getWGN(5,1,3)
    ];
    for(i = 0; i < arr.length; i ++) {
        G.insertWGN(arr[i]);
    }
    A = topologicalDAGShortestPaths(G, 0);
    console.log(A.customString(customHandleFunForBellmanFord));
}
// testTopoDagShortestPaths()
function criticalPath(G, s){//有向无环图最长路径，即关键路径
    let iterator, wgn;
    result = G.topoSort();
    for(let node of result){
        node.d = -Infinity;
    }
    result.get(s).d = 0;
    for(let node of result){
        iterator = G.wgnIterator(node.data);
        while(iterator.hasNext()){
            wgn = iterator.next();
            bigRelax(node, result.get(wgn.vertex), wgn.weight);
        }
    }
    result.noChildTrim();
    return result;
}
function testCriticalPath(){
    let info = ["s", "t", "x", "y", "z", "r"], G = new linkedGraph(6, info), i;
    arr = [
        getWGN(0,1,2),
        getWGN(0,2,6),
        getWGN(1,2,7),
        getWGN(1,3,4),
        getWGN(1,4,2),
        getWGN(2,3,-1),
        getWGN(2,4,1),
        getWGN(3,4,-2),
        getWGN(5,0,5),
        getWGN(5,1,3)
    ];
    for(i = 0; i < arr.length; i ++) {
        G.insertWGN(arr[i]);
    }
    A = criticalPath(G, 0);
    console.log(A.customString(customHandleFunForBellmanFord));
}
testCriticalPath();