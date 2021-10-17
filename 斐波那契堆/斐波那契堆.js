//注意全篇没有类型判断
var {random, floor} = Math;
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
        this.maxNumLen = 4;//用于showString打印堆到控制台，表示最长的数字位数
    }
    showString(){//把堆结构打印到控制台
        let str = "", space = "", i;
        for(i = 0; i < this.maxNumLen + 3; i ++){
            space += " ";
        }
        let fun = (h, width)=>{
            for(let a of h){
                str += a.key;
                if(a.degree > 0){
                    i = this.maxNumLen - getWidth(a.key);
                    if(i < 0) str += "→ ";
                    else {
                        while(i > 0){
                            str += " ";
                            i --;
                        }
                        str+=" → ";
                    }
                    fun(a.childList, width + 1);
                }
                if(a.right != h.door) {
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
        this.decreaseKey(node, -Infinity);
        this.extractMin();
    }
    decreaseKey(node, k){//将node节点的键值减小
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
    }
    cut(p, node){//将node从其父节点p中剪切掉插入根链表中
        p.degree --;
        p.childList.delete(node);//注意先输出再插入问题，对在堆中的节点去插入是错误的
        node.p = null;
        node.mark = false;
        this.rootList.insert(node);
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
        if(this.min == null) this.min = node;
        else if(this.min.key > node.key) this.min = node;
        this.rootList.insert(node);
        this.n ++;
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
            if(node.degree > 0) for(let a of node.childList){
                a.p = null;
                this.rootList.insert(a);
            }
            this.rootList.delete(node);
            if(node.right == node) this.min = null;
            else{
                this.min = node.right;
                this.consolidate();
            }
            this.n --;
        }
        return node;
    }
    consolidate(){//在体取最小节点后完成对堆中所有根节点的度数保持不相同的状态
        let temp = floor(Math.log2(this.n)) + 1, d, y, A = this.arr;
        if(A == null || A.length < temp){
            A = new Array(temp);
        }
        for(let i = 0; i < temp; i ++) A[i] = null;
        for(let a of this.rootList){
            d = a.degree;
            if(d >= temp) console.log(`MaxDegree: ${temp}, node: ${a}`);
            while(A[d] != null){
                y = A[d];
                if(y.key < a.key){
                    [a, y] = [y, a];
                }
                this.rootList.delete(y);//注意这里在遍历根链表时删除了正在遍历的节点，可以这样做的原因是，删除时没有改变y节点的值，在迭代器中仍然可以通过y节点访问到其后继节点
                a.childInsert(y);//注意这里先删除再插入，因为插入动作会改变y节点的左右节点指向，而删除操作需要改变y的左右节点指向y的指针，使y的左右节点互相引用。
                A[d] = null;
                d ++;
            }
            A[d] = a;
        }
        for(let a of A){
            if(a != null){
                if(a.key < this.min.key) this.min = a;
            }
        }
        this.arr = A;
    }
}
class fibHeapNode{
    constructor(){
        this.key = null;
        this.degree = 0;//子节点的个数
        this.mark = false;
        this.p = null;
        this.childList = null;//指向由子节点构成的双循环链表
        this.left = null;
        this.data = null;
    }
    childInsert(node){//插入此节点的子节点循环链表
        if(this.childList == null) this.childList = new doubleLinkedList();
        node.p = this;
        node.mark = false;
        this.childList.insert(node);
        this.degree ++;
    }
    check(){//递归的检查以此节点为根的子树的正确性
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
}
class doubleLinkedList{//注意不可以对已经删除的节点再删除，和对插入的节点再插入，因为没有做节点是否在链表的判断
    constructor(){
        this.door = null;
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
            str += a.key + " ⇋ ";
        }
        console.log(str);
    }
}
function test1(){//完成插入，联合，最小节点，双向循环链表的字符串显示，开始测试
    let h1 = new fibHeap(), h2 = new fibHeap(), num = 10, x1 = floor(random()*num), x2 = floor(random()*num), key;
    for(let i = 0; i < x1; i ++){
        key = floor(random()*num);
        console.log(key);
        h1.insert(h1.creatNode(key, null));
    }
    h1.rootList.toString();
    for(let i = 0; i < x2; i ++){
        key = floor(random()*num);
        console.log(key);
        h2.insert(h2.creatNode(key, null));
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
        h1.insert(h1.creatNode(key, null));
    }
    h1.rootList.showString();
    for(let a of h1.rootList) console.log(a);
}
function test3(){//测试fib堆的提取最小节点函数
    let h1 = new fibHeap(), num = 10, x1 = floor(random()*num) + 4, key, arr = new Array(x1);
    for(let i = 0; i < x1; i ++){
        key = floor(random()*num);
        console.log(key);
        arr[i] = h1.creatNode(key, null);
        h1.insert(arr[i]);
    }

    h1.rootList.showString();
    h1.extractMin();
    for(let a of h1.rootList) console.log(a);
}
function test4(){//测试fib堆的删除以及其它
    let h1 = new fibHeap(), x1 = 200, x2 = 100, key, arr = new Array(x1);
    for(let i = 0; i < x1; i ++){
        key = floor(random()*999);
        arr[i] = h1.creatNode(key, null);
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
    for(let i = 0; i < 20; i ++){
        h1.extractMin();
    }
    console.log("extractMin: ", h1.check());
    h1.showString();
}
test4()