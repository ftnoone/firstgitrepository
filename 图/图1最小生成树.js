class disjointSet{//不相交集合，支持查找集合和合并集合操作
    constructor(data){
        this.p = this;
        this.data = data;
        this.rank = 0;
    }
    union(set){//按秩合并，让小的秩集合合并到大的秩的集合
        return this.findSet().link(set.findSet());
    }
    getData(){//返回数据
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
    beTraversed(){//表示这是被遍历过后的结果，可以输出
        this.traversed = true;
    }
    showString(){
        if(this.traversed) console.log(super.beString());
    }
}
class weightGraphNode{//带权图的邻接链表节点，from出发边，vertex目的边，weight权重
    constructor(from, vertex, weight){
        this.from = from;
        this.vertex = vertex;
        this.weight = weight;
    }
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
        this.dfsResult = null;
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
    clearDfs(){//清空dfs遍历后生成的森林
        this.dfsResult = null;
    }
    dfs(){//dfs遍历后，会生成当前图的遍历结果并保存，当图改变时需要遍历则需要调用cleardfs清理结果
        if(this.dfsResult != null) return this.dfsResult;
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
        this.dfsResult = result;
        result.traversed = true;
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
    getInfo(a){//返回indo数组
        if(this.info == null) return null;
        else return this.info[a];
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
                str += a.key;
                if(a.degree > 0){
                    i = maxNumLen - getWidth(a.key);
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
        console.log(str);
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
                str += handle(a.key, a.data);
                if(a.degree > 0){
                    i = maxNumLen - handle(a.key, a.data).length;
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
        console.log(str);
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
        let temp = new fibHeapNode();
        temp.key = key;
        temp.data = data;
        return temp;
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
                a.childInsert(y);//注意这里先删除再插入，因为插入动作会改变y节点的左右节点指向，而删除操作需要改变y的左右节点指向y的指针，使y的左右节点互相引用。
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
    constructor(){
        super(null);
        this.key = null;
        this.degree = 0;//子节点的个数
        this.mark = false;
        this.p = null;
        this.childList = null;//指向由子节点构成的双循环链表
    }
    childInsert(fibNode){//插入此节点的子节点循环链表
        if(this.childList == null) this.childList = new doubleLinkedList();
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
    getData(){
        return this.data;
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
        iterator = G.indexIterator(u);
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
let root;//高度较为平衡的树根？树高详情看书不相交集合的理论部分
function kruskal(G){//kruskal算法最小生成树，使用linkedGraph，参数为带权图，返回生成树的边
    let arr = new Array(G.n), i, edges = G.getEdges(), u, v, A = new Array(G.n - 1);
    edges.sort((a, b)=>a.weight - b.weight);
    for(i = 0; i < arr.length; i ++) arr[i] = new disjointSet({vertex: i, info: G.getInfo(i)});
    i = 0;
    for(let edge of edges){
        u = edge.from;
        v = edge.vertex;
        if(arr[u].findSet() != arr[v].findSet()){
            A[i ++] = edge;
            arr[u].union(arr[v]);
        }
    }
    root = arr[0].findSet().getData().vertex;
    return A;
}
function getWGN(...arg){//生成weightGraphNode节点
    return new weightGraphNode(...arg);
}
let time, arr;
function testMinimumSpanningTree(){//对书上一个图测试最小生成树算法
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
    let A = kruskal(G), t = new linkedGraph(9, info);
    console.log(A);
    for(let a of A) {//无向图用linkedGraph实现需插入(u,v),(v,u)两个有向边，因为dfs遍历的实现会创建新的数据结构存放图的顶点，并会对遍历过的值做标记，所以重复插入对dfs遍历没有影响
        t.insertWGN(a);
        t.insertE(a.vertex, a.from, a.weight);
    }
    //A.showString();
    let result = new graphTraverseResult(t.n, info);
    arr = result.getArr();//因为使用递归dfs遍历需要全局变量arr,time，所以需要先赋值初始化
    dfsVisit(t, root);//因为生成树是树，所以单独对树遍历即可
    result.beTraversed();//遍历完成
    result.showString();//控制台输出结果
}
function testPrim(){//对书上一个图测试最小生成树算法
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
    let A = prim(G), t = new linkedGraph(9, info);
    console.log(A);
    for(let a of A) {//无向图用linkedGraph实现需插入(u,v),(v,u)两个有向边，因为dfs遍历的实现会创建新的数据结构存放图的顶点，并会对遍历过的值做标记，所以重复插入对dfs遍历没有影响
        t.insertWGN(a);
        t.insertE(a.vertex, a.from, a.weight);
    }
    //A.showString();
    let result = new graphTraverseResult(t.n, info);
    arr = result.getArr();//因为使用递归dfs遍历需要全局变量arr,time，所以需要先赋值初始化
    dfsVisit(t, 0);//因为生成树是树，所以单独对树遍历即可
    result.beTraversed();//遍历完成
    result.showString();//控制台输出结果
}
testPrim();
function dfsVisit(G, u){//相当于对以u为根的树进行遍历
    time ++;
    arr[u].d = time;
    arr[u].color = 1;
    let iterator = G.indexIterator(u), key;
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
var fib;
function prim(G, root = 0){
    let Q = new fibHeap(), arr = new Array(G.n), i, iterator, vertexFibNode, wgn, result = new Array(G.n - 1), index;
    fib = Q;
    for(i = 0; i < G.n; i ++){
        arr[i] = Q.creatNode(Infinity, {
            index: i,
            p: null
        });
        Q.insert(arr[i]);
    }
    i = 0;
    Q.decreaseKey(arr[root], 0);
    while(!Q.isEmpty()){
        vertexFibNode = Q.extractMin();
        fib.customString(customHandleFunForPrim);
        index = vertexFibNode.getData().index;
        if(index != root){
            result[i ++] = new weightGraphNode(vertexFibNode.getData().p, index, vertexFibNode.getKey());
        }
        arr[index] = null;
        iterator = G.wgnIterator(index);//带权图节点遍历器
        while(iterator.hasNext()){
            wgn = iterator.next();
            vertexFibNode = arr[wgn.vertex];
            if(vertexFibNode != null){
                if(wgn.weight < vertexFibNode.getKey()){
                    vertexFibNode.getData().p = wgn.from;
                    Q.decreaseKey(vertexFibNode, wgn.weight);
                }
            }
        }
    }
    return result;
}
function customHandleFunForPrim(key, data){
    if(key == Infinity) key = "*";
    return data.index +":"+key;
}