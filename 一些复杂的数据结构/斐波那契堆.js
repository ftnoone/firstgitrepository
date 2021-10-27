//注意全篇没有类型判断
var {random, floor} = Math, fib;
class listNode{//链表的节点
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
    get(){
        return this.data;
    }
}
class doubleLinkedList{//注意不可以对已经删除的节点再删除，和对插入的节点再插入，因为没有做节点是否在链表的判断，上层自己实现
    constructor(){
        this.door = null;//链表入口
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
        if(!(node instanceof listNode)) return null;
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
    customInsert(x, y){//x插入y左边，插入的是listnode类
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
            str += a.data + " ⇋ ";
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
function test1(){//完成插入，联合，最小节点，双向循环链表的字符串显示，开始测试
    let h1 = new fibHeap(), h2 = new fibHeap(), num = 10, x1 = floor(random()*num), x2 = floor(random()*num), key;
    for(let i = 0; i < x1; i ++){
        key = floor(random()*num);
        console.log(key);
        h1.insert(h1.creatNode(key, key));
    }
    h1.rootList.showString();
    for(let i = 0; i < x2; i ++){
        key = floor(random()*num);
        console.log(key);
        h2.insert(h2.creatNode(key, key));
    }
    h2.rootList.showString();
    h1.union(h2);
    h1.rootList.showString();
}   
function test2(){//测试双循环链表的迭代器
    let h1 = new fibHeap(), num = 10, x1 = floor(random()*num) + 4, key;
    for(let i = 0; i < x1; i ++){
        key = floor(random()*num);
        console.log(key);
        h1.insert(h1.creatNode(key, key));
    }
    h1.rootList.showString();
    for(let a of h1.rootList) console.log(a);
}
function test3(){//测试fib堆的提取最小节点函数
    let h1 = new fibHeap(), num = 10, x1 = floor(random()*num) + 4, key, arr = new Array(x1);
    for(let i = 0; i < x1; i ++){
        key = floor(random()*num);
        console.log(key);
        arr[i] = h1.creatNode(key, key);
        h1.insert(arr[i]);
    }

    h1.rootList.showString();
    h1.extractMin();
    for(let a of h1.rootList) console.log(a);
}
function test4(){//测试fib堆的删除以及其它
    let h1 = new fibHeap(), x1 = 500, x2 = 300, x3 = 50, key, arr = new Array(x1);
    for(let i = 0; i < x1; i ++){
        key = floor(random()*999);
        arr[i] = h1.creatNode(key, key);
        h1.insert(arr[i]);
        // console.log("insert: ", key);
        // h1.showString();
    }
    console.log("insert: ", h1.check());
    for(let i = 0; i < x2; i ++){
        key = floor(random()*x1);
        if(arr[key] != null) {
            // console.log("delete: ", arr[key].key);
            h1.delete(arr[key]);
            // h1.showString();
            arr[key] = null;
        }
    }
    console.log("delete: ", h1.check());
    h1.showString();
    for(let i = 0; i < x3; i ++){
        h1.extractMin();
    }
    console.log("extractMin: ", h1.check());
    h1.showString();
}