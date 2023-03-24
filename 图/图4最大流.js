
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
        this.childList = new doubleLinkedList();//孩子链表，放是linkedForestNode
    }
    insert(node){//插入森林节点
        this.childList.insert(node);
        node.p = this;
    }
    setP(node){
        this.p = node;
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
        this.arr = arr;
        return true;
    }
    noChildTrim(){//针对单源最短路径先求出父节点，再整理添加到森林的子节点列表中
        let p;
        for(let a of this.arr){
            if((p = a.p) != null){
                if(!(p.childList.member(a))){
                    p.insert(a);
                }
            }
        }
    }
    showString(){
        console.log(this.customString((node)=>node.key));
    }
    customString(fun){//森林深度优先遍历
        let arr = this.arr, s = new stack(arr.length), str = "", d, iterator, forestNode, indent, indentStep, ifLine = false, arri;
        for(let i = 0; i < arr.length; i ++){
            //d表示层数，每次向下降一层加一，indent表示下一次添加字符需要几个\t
            arri = this.get(i);
            if(arri.p == null){
                d = 0;
                indent = 1;
                if(ifLine) str += "\n";//是否换行
                str += `t[${i}]: \t` + fun(arri);
                iterator = arri.childList.valIterator();//子节点由双循环队列组成
                ifLine = false;//换行了下一行不换
                do{
                    while(iterator.hasNext()){
                        d ++;
                        forestNode = iterator.next();
                        if(ifLine) str += "\n";//换行
                        for(indentStep = 0; indentStep < indent; indentStep ++) str += "\t";//保持输出对齐
                        str += fun(forestNode);
                        s.push(iterator);
                        iterator = forestNode.childList.valIterator();
                        indent = 1;//重置缩进的制表符
                        ifLine = false;//重置换行
                    }
                    ifLine = true;//开始回溯，所以换行输出结果
                    indent = d + 1;//arri占一个制表符，所以换行后的制表符多一
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
    constructor(key, data){
        super(key, data);
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
        this.map = null;
    }
    get(i){//针对拓扑排序，会改变节点的顺序，所以创建一个映射能使用原索引访问改变后的节点
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
}
class weightGraphNode{//带权图的邻接链表节点，from出发边，vertex目的边，weight权重
    constructor(from, vertex, weight, data = null){
        this.from = from;
        this.vertex = vertex;
        this.weight = weight;
        this.data = data;
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
        this.e = new Array(n);//邻接边集
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
    topoSort(start = 0){//从start节点开始拓扑排序，拓扑排序的结果没有设置子节点，需要调用nochildtrim再打印
        let result = new graphTraverseResult(this.n, this.info), j, i, time = 0, iterator, parent, child, s = new stack(this.n), resultNode;
        for(i = 0; i < this.n; i ++){
            j = (start + i) % this.n;
            resultNode = result.get(j);
            if(resultNode.color == 0) {
                iterator = this.indexIterator(j);
                time ++;
                resultNode.d = time;
                resultNode.color = 1;
                parent = j;
                while(true){
                    while(iterator.hasNext()){
                        child = iterator.next();
                        resultNode = result.get(child);
                        if(resultNode.color == 0){
                            s.push(iterator);
                            time ++;
                            resultNode.d = time;
                            resultNode.color = 1;
                            resultNode.setP(result.get(parent));
                            iterator = this.indexIterator(child);
                            parent = child;
                        }
                    }
                    result.get(parent).color = 2;
                    time ++;
                    result.get(parent).f = time;
                    if(!s.isEmpty()){
                        iterator = s.pop();
                        parent = iterator.key;
                    }else break;
                }
            }
        }
        arr.sort((a, b)=>b.f - a.f);
        let map = new Array(this.n);
        for(j = 0; j < arr.length; j ++){
           map[result.get(j).data] = j;//改变了节点顺序，需要创建映射信息
        }
        result.map = map;
        result.setChanged(true);
        return result;
    }
    bfs(start = 0){//基于队列存储节点信息，从start处广度优先遍历
        let result = new graphTraverseResult(this.n, this.info), q = new queue(this.n);
        q.enqueue(start);
        let iterator, child, parent, resultChildNode, resultParentNode;
        while(!q.isEmpty()){
            parent = q.dequeue();
            resultParentNode = result.get(parent);
            iterator = this.indexIterator(parent);
            while(iterator.hasNext()){
                child = iterator.next();
                resultChildNode = result.get(child);
                if(resultChildNode.color == 0){
                    resultChildNode.d = resultParentNode.d + 1;
                    resultParentNode.insert(resultChildNode);
                    resultChildNode.color = 1;
                    q.enqueue(child);
                }
            }
        }
        return result;
    }
    dfs(start = 0){//dfs从start节点开始遍历
        let result = new graphTraverseResult(this.n, this.info), j, i, time = 0, iterator, parent, child, s = new stack(this.n), resultNode;
        for(i = 0; i < this.n; i ++){
            j = (start + i) % this.n;
            resultNode = result.get(j);
            if(resultNode.color == 0) {
                iterator = this.indexIterator(j);
                time ++;
                resultNode.d = time;
                resultNode.color = 1;
                parent = j;
                while(true){
                    while(iterator.hasNext()){
                        child = iterator.next();
                        resultNode = result.get(child);
                        if(resultNode.color == 0){
                            s.push(iterator);
                            time ++;
                            resultNode.d = time;
                            resultNode.color = 1;
                            result.get(parent).insert(resultNode);
                            iterator = this.indexIterator(child);
                            parent = child;
                        }
                    }
                    result.get(parent).color = 2;
                    time ++;
                    result.get(parent).f = time;
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
        this.dfs().showString();
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
                str += `\t→[${graphNode.vertex}]${this.getIndexInfo(graphNode.vertex)}:${graphNode.weight} `;
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
    clear(){
        this.n = 0;
        this.door = null;
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
                if(node.right == that.door || that.door == null) ifEnd = true;
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
                if(node.right == that.door || that.door == null) ifEnd = true;
                node = node.right;
                return val;
            },
            hasNext(){
                return !ifEnd;
            }
        };
    }
    showString(){//将循环链表的键值用字符串输出到控制台
        console.log(this.customString((a)=>a.key));
    }
    customString(handle){
        if(this.isEmpty()) {
            return "null";
        }
        let str = '';
        for(let a of this){
            str += handle(a) + " ⇋ ";
        }
        return str;
    }
}
function getWidth(num){
    let i = 1;
    while((num/=10) >= 1) i++;
    return i;
}
class fibHeap{
    constructor(){
        this.min = null;//指向堆的最小键值结点
        this.rootList = new doubleLinkedList();//由根结点构成的双循环链表
        this.n = 0;//总结点数
        this.arr = null;//度数数组
    }
    isEmpty(){
        return this.min == null;
    }
    checkNode(node){
        if(node instanceof fibHeapNode) return true;
        return false;
    }
    showString(){//把堆结构打印到控制台
        console.log(this.customString((a)=>`${a.key}`));
    }
    customString(handle){//把堆结构打印到控制台
        if(this.min == null) {
            console.log("null");
            return;
        }
        let str = "", space = "", i, maxNumLen = 4, degreeLen = maxNumLen >>> 1, frontInfoLen = 5 + degreeLen, frontSpace = "", ifLine = false;
        //maxNumLen表示最长的数字位数,frontInfoLen表示前面存放前置信息的长度
        for(i = 0; i < maxNumLen + 3; i ++){//3代表每个节点中间的连接符号占三个字符，这里连接符号是□→□
            space += " ";
        }
        for(i = 0; i < frontInfoLen; i ++){
            frontSpace += " ";
        }
        let fun = (h, width)=>{
            for(let a of h){
                if(width == 0){
                    i = degreeLen - getWidth(a.degree);
                    str += `d[${a.degree}]: `;
                    while(i > 0){
                        str += " ";
                        i --;
                    }
                }else if(ifLine){
                    str += frontSpace;
                }
                ifLine = false;
                str += handle(a);
                if(a.degree > 0){
                    i = maxNumLen - handle(a).length;
                    if(i < 0) str += "→ ";//当超过maxnum时，如对于maxnum=4，则如下所示
                    //4567□→□
                    //45678→□
                    //123□□→□
                    else {
                        while(i > 0){
                            str += " ";
                            i --;
                        }
                        str+=" → ";
                    }
                    fun(a.childList, width + 1);//打印子列表，深度遍历打印
                }
                if(a.right != h.door) {//因为是深度遍历，在打印兄弟节点时换行
                    ifLine = true;
                    str += "\n";
                    for(i = 0; i < width; i ++){
                        str += space;
                    }
                }
            }
        }
        fun(this.rootList, 0);
        return str;
    }
    delete(node){
        if(!this.checkNode(node)) return false;
        this.decreaseKey(node, -Infinity);
        this.extractMin();
        return true;
    }
    decreaseKey(node, k){//将node节点的键值减小
        if(!this.checkNode(node)) return false;
        if(k > node.key){
            console.log(`new key: ${k}, old key: ${node.key}`);
            return;
        }
        node.key = k;
        let p = node.p;
        if(p != null && k < p.key){
            this.cut(p, node)
            this.cascadingCut(p);
        }
        if(k < this.min.key) this.min = node;
        return true;
    }
    cut(p, node){//将node从其父节点p中剪切掉插入根链表中
        p.degree --;
        p.childList.nodeDelete(node);//注意先删除再插入问题，对在堆中的节点去插入是错误的
        node.p = null;
        node.mark = false;
        this.rootList.nodeInsert(node);
    }
    cascadingCut(node){//如果node节点成为别人的子节点并丢失过子节点，进行级联剪切，保证子节点数量的下界
        let p = node.p;
        if(p != null){
            if(node.mark){
                this.cut(p, node)
                this.cascadingCut(p);
            }else node.mark = true;
        }
    }
    check(){//检查堆结构正确性
        for(let a of this.rootList){
            if(!a.check()) return false;
        }
        return true;
    }
    creatNode(key, data){//生成一个fib堆的节点
        return new fibHeapNode(key, data);
    }
    insert(node){//将fib节点插入fib堆
        if(!(node instanceof fibHeapNode)) return false;
        if(this.min == null) this.min = node;
        else if(this.min.key > node.key) this.min = node;
        this.rootList.nodeInsert(node);
        this.n ++;
        return true;
    }
    minimum(){//返回最小节点
        return this.min;
    }
    union(h){//连接两个fib堆
        let m1 = this.min || h.min, m2 = h.min || this.min;
        this.min = m1<m2?m1:m2;
        this.rootList.union(h.rootList);
        this.n += h.n;
    }
    extractMin(){//提取最小节点
        let node = this.min;
        if(node != null){
            if(node.degree > 0) {
                if(node.childList == null){
                    console.log(this.rootList, node);
                }
                for(let a of node.childList){
                    a.p = null;
                    this.rootList.nodeInsert(a);//因为在获得a节点之前，遍历器已经获得a节点的后继节点，可以改变a节点的信息
                }
            }
            this.rootList.nodeDelete(node);//删除不改变node节点的值
            if(node.right == node) {
                this.min = null;
            }
            else{
                this.min = node.right;
                this.consolidate();
            }
            this.n --;
        }
        return node;
    }
    consolidate(){//在体取最小节点后完成对堆中所有根节点的度数保持不相同的状态
        let temp = 2*floor(Math.log2(this.n)), d, y, A = this.arr;
        if(A == null || A.length < temp){
            A = new Array(temp);
        }
        for(let i = 0; i < temp; i ++) A[i] = null;
        for(let a of this.rootList){//因为有输出操作，使用链表节点遍历器快速删除
            d = a.degree;
            if(d >= temp) {
                fib = this;
                console.log(a);
                throw new Error(`MaxDegree: ${temp}, node: ${d}`);
            }
            while(A[d] != null){
                y = A[d];
                if(y.key < a.key){
                    [a, y] = [y, a];
                }
                this.rootList.nodeDelete(y);//注意这里在遍历根链表时删除了正在遍历的节点，可以这样做的原因是，遍历器已经获得遍历节点的后继节点信息
                a.insert(y);//注意这里先删除再插入，因为插入动作会改变y节点的左右节点指向，而删除操作需要改变y的左右节点指向y的指针，使y的左右节点互相引用。
                A[d] = null;
                d ++;
            }
            A[d] = a;
        }
        for(let i = 0; i < temp; i ++) {
            if(A[i] != null){
                if(A[i].key < this.min.key) this.min = A[i];
            }
        }
        this.arr = A;
    }
}
class fibHeapNode extends listNode{
    constructor(key, data){
        super(data);
        this.key = key;
        this.degree = 0;//子节点的个数
        this.mark = false;
        this.p = null;
        this.childList = new doubleLinkedList();//指向由子节点构成的双循环链表
    }
    insert(fibNode){//插入此节点的子节点循环链表
        fibNode.p = this;
        fibNode.mark = false;
        this.childList.nodeInsert(fibNode);
        this.degree ++;
    }
    check(){//递归的检查以此节点为根的子树的正确性，检查双循环链表的正确性要遍历链表节点
        let i = 0, j = this.degree;
        if(j != 0 && this.childList == null) return false;
        if(j == 0) return true;
        for(let a of this.childList){
            if(a.right.left != a) return false;
            if(a.p != this) return false;
            if(!(a.check())) return false; 
            i ++;
        }
        if(i != j) return false;
        return true;
    }
    getKey(){
        return this.key;
    }
}
class matrixGraph{//带权有向图
    //无向图用linkedGraph实现需插入(u,v),(v,u)两个有向边，因为dfs遍历的实现会创建新的数据结构存放图的顶点，并会对遍历过的值做标记，所以重复插入对dfs遍历没有影响
    constructor(n, info){
        this.e = new Array(n);//邻接边集
        for(let i = 0; i < n; i ++) {
            this.e[i] = new Array(n).fill(Infinity);
            this.e[i][i] = 0;
        }
        this.n = n;//顶点数
        this.info = null;//顶点的名字
        this.edgeNum = 0;//边数
        this.setInfo(info);
    }
    getMatrix(){
        return this.e;
    }
    getEdges(){
        let arr = new Array(this.edgeNum), iterator, j = 0;
        for(let i = 0; i < this.n; i ++){
            iterator = this.wgnIterator(i);
            while(iterator.hasNext()){
                arr[j ++] = iterator.next();
            }
        }
        return arr;
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
    topoSort(start = 0){//从start节点开始拓扑排序，拓扑排序的结果没有设置子节点，需要调用nochildtrim再打印
        let result = new graphTraverseResult(this.n, this.info), j, i, time = 0, iterator, parent, child, s = new stack(this.n), resultNode;
        for(i = 0; i < this.n; i ++){
            j = (start + i) % this.n;
            resultNode = result.get(j);
            if(resultNode.color == 0) {
                iterator = this.indexIterator(j);
                time ++;
                resultNode.d = time;
                resultNode.color = 1;
                parent = j;
                while(true){
                    while(iterator.hasNext()){
                        child = iterator.next();
                        resultNode = result.get(child);
                        if(resultNode.color == 0){
                            s.push(iterator);
                            time ++;
                            resultNode.d = time;
                            resultNode.color = 1;
                            resultNode.setP(result.get(parent));
                            iterator = this.indexIterator(child);
                            parent = child;
                        }
                    }
                    result.get(parent).color = 2;
                    time ++;
                    result.get(parent).f = time;
                    if(!s.isEmpty()){
                        iterator = s.pop();
                        parent = iterator.key;
                    }else break;
                }
            }
        }
        arr.sort((a, b)=>b.f - a.f);
        let map = new Array(this.n);
        for(j = 0; j < arr.length; j ++){
           map[result.get(j).data] = j;//改变了节点顺序，需要创建映射信息
        }
        result.map = map;
        result.setChanged(true);
        return result;
    }
    bfs(start = 0){//基于队列存储节点信息，从start处广度优先遍历
        let result = new graphTraverseResult(this.n, this.info), q = new queue(this.n);
        q.enqueue(start);
        let iterator, child, parent, resultChildNode, resultParentNode;
        while(!q.isEmpty()){
            parent = q.dequeue();
            resultParentNode = result.get(parent);
            iterator = this.indexIterator(parent);
            while(iterator.hasNext()){
                child = iterator.next();
                resultChildNode = result.get(child);
                if(resultChildNode.color == 0){
                    resultChildNode.d = resultParentNode.d + 1;
                    resultParentNode.insert(resultChildNode);
                    resultChildNode.color = 1;
                    q.enqueue(child);
                }
            }
        }
        return result;
    }
    dfs(start = 0){//dfs从start节点开始遍历
        let result = new graphTraverseResult(this.n, this.info), j, i, time = 0, iterator, parent, child, s = new stack(this.n), resultNode;
        for(i = 0; i < this.n; i ++){
            j = (start + i) % this.n;
            resultNode = result.get(j);
            if(resultNode.color == 0) {
                iterator = this.indexIterator(j);
                time ++;
                resultNode.d = time;
                resultNode.color = 1;
                parent = j;
                while(true){
                    while(iterator.hasNext()){
                        child = iterator.next();
                        resultNode = result.get(child);
                        if(resultNode.color == 0){
                            s.push(iterator);
                            time ++;
                            resultNode.d = time;
                            resultNode.color = 1;
                            result.get(parent).insert(resultNode);
                            iterator = this.indexIterator(child);
                            parent = child;
                        }
                    }
                    result.get(parent).color = 2;
                    time ++;
                    result.get(parent).f = time;
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
        this.dfs().showString();
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
            let val = this.e[a][b];
            if(val != Infinity) return true;
        }
        return false;
    }
    setWeight(a, b, w){//设置edge(a, b)的权重
        if(this.check(a) && this.check(b)){
            this.e[a][b] = w;
        }
    }
    getWeight(a, b){//获得edge(a, b)的权重，不存在边返回权重0
        if(this.check(a) && this.check(b)){
            return this.e[a][b];
        }
        return 0;
    }
    insertE(a, b, w = 1){//插入边，需要先检查不存在这个边防止重复插入
        if(!this.memberE(a, b)){
            this.e[a][b] = w;
            this.edgeNum ++;
            return true;
        }else return false;
    }
    insertWGN(wgn){//插入weightgraphnode带权节点，需要先检查不存在这个边防止重复插入
        if(wgn instanceof weightGraphNode){
            if(!this.memberE(wgn.from, wgn.vertex)){
                this.e[wgn.from][wgn.vertex] = wgn.weight;
                this.edgeNum ++;
                return true;
            }
        }else return false;
    }
    deleteE(a, b){
        if(this.check(a) && this.check(b)){//因为双循环队列的实现，使用直接删除节点很快。
            this.e[a][b] = Infinity;
            this.edgeNum --;
            return true;
        }
        return false;
    }
    getRow(a){
        if(this.check(a)){
            return this.e[a];
        }
        return null;
    }
    showString(start = 0){//展示邻接链表
        console.log(this.beString(start));
    }
    showMatrix(){
        let str = "", row, w;
        for(let i = 0, len = this.n, j; i < len; i ++){
            row = this.getRow(i);
            for(j = 0; j < len; j ++){
                w = row[j];
                if(w == Infinity) w = "*";
                str += `${w}\t`;
            }
            str += "\n";
        }
        console.log(str);
        return str;
    }
    beString(start = 0){
        let str = "", iterator, wgn, j;
        for(let i = 0, len = this.n; i < len; i ++){
            j = (start + i) % len;
            str += `[${j}]${this.getIndexInfo(j)}: `;
            iterator = this.wgnIterator(j);
            while(iterator.hasNext()){
                wgn = iterator.next();
                str += `\t→[${wgn.vertex}]${this.getIndexInfo(wgn.vertex)}:${wgn.weight} `;
            }
            str += "\n";
        }
        return str;
    }
    getIndexInfo(a){
        if(this.info == null) return null;
        else return this.info[a];
    }
    getInfo(){
        return this.info;
    }
    indexIterator(a){
        if(!this.check(a)) return null;
        let adj = this.e[a], i = 0, n = this.n, vertex;
        return {
            next(){
                vertex = i;
                i ++;
                return vertex;
            },
            hasNext(){
                while(i < n && adj[i] == Infinity) i ++;
                return i < n;
            },
            key: a
        }
    }
    wgnIterator(a){//下层是双循环链表，对上提供对顶点a的邻接链表的迭代器，返回值是带权图节点，weightgraphnode
        if(!this.check(a)) return null;
        let adj = this.e[a], index, iterator = this.indexIterator(a);
        return {
            next(){
                index = iterator.next();//节点索引
                return new weightGraphNode(a, index, adj[index]);
            },
            hasNext(){
                return iterator.hasNext();
            },
            key: a
        }
    }
}
function fordFulkerson(g, s = 0, t = g.n - 1){
    let edges = g.getEdges(), Gf = new matrixGraph(g.n, g.getInfo()), augmentationPath;
    for(let i = 0; i < g.n; i ++){
        Gf.setWeight(i, i, Infinity);
    }
    for(let edge of edges){
        Gf.insertE(edge.from, edge.vertex, edge.weight);
    }
    let min, wgn, index, weight;
    while((augmentationPath = BFSForEdmondsKarp(Gf, s, t)) != null){
        index = t;
        min = Infinity;
        do{
            wgn = augmentationPath[index];
            if(wgn.weight < min) min = wgn.weight;
            index = wgn.from;
        }while(index != s);
        index = t;
        do{
            wgn = augmentationPath[index];
            weight = wgn.weight - min;
            index = wgn.from;
            if(weight == 0) Gf.deleteE(index, wgn.vertex);
            else Gf.setWeight(index, wgn.vertex, weight);
            if(Gf.memberE(wgn.vertex, index)){
                Gf.setWeight(wgn.vertex, index, Gf.getWeight(wgn.vertex, index) + min);
            }else {
                Gf.insertE(wgn.vertex, index, min);
            }
        }while(index != s);
        Gf.showMatrix();
        Gf.showString(s);
    }
}
function BFSForEdmondsKarp(G, start = 0, end){//基于队列存储节点信息，从start处广度优先遍历
    let result = new Array(G.n).fill(null), q = new queue(G.n);
    q.enqueue(start);
    let iterator, index, wgn;
    while(!q.isEmpty()){
        index = q.dequeue();
        iterator = G.wgnIterator(index);
        while(iterator.hasNext()){
            wgn = iterator.next();
            index = wgn.vertex;
            if(result[index] == null){
                result[index] = wgn;
                if(index == end) return result;
                q.enqueue(index);
            }
        }
    }
    return null;
}
function getWGN(...arg){//生成weightGraphNode节点
    return new weightGraphNode(...arg);
}
function testbfs(){
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
    A = G.bfs();
    A.showString();
}
function testFordFulkerson(){
    let g = new linkedGraph(6, ["s", "v1", "v2", "v3", "v4", "t"]);
    g.insertE(0,1,16);
    g.insertE(0,2,13);
    g.insertE(1,3,12);
    g.insertE(2,1,4);
    g.insertE(2,4,14);
    g.insertE(3,2,9);
    g.insertE(3,5,20);
    g.insertE(4,3,7);
    g.insertE(4,5,4);
    fordFulkerson(g);
}
testFordFulkerson();