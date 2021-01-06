class singleArrList{//以下说的最高位建立在是4个字节32位的整型的情况下，我用对c语言的部分理解来写的数组链表，但是js的数字并不是固定的整型，也可以更大，更换类型等
    constructor(size){//分配size*3大小的数组，用来做链表的分配，同一个数组可以用作多个链表的使用
        this.arr = new Array(size * 3);//在free链中 用每三个挨着的数组空间的第一个空间放置下一个节点的索引，在this.free中放第一个free节点的索引，可以通过this.free头一个一个访问
        this.size = size;
        this.free = 0;//free链的头，free链表示所有的空的节点，即可以拿来分配的节点
        this.freeBit = 32;//原来的compactify要扫描从0整个数组，比较笨，遗留下需要确定是否是free链中的元素的问题（现在直接扫描free链，然后放进最小二叉堆取出最左边，最小 的元素），如果你看到了，可以试着更改
        this.freeNode = 1 << (this.freeBit - 1);//用来获取free节点和确定是否是free节点，是则设置最高位是1，获取只要把最高位变成0即可
        this.nullNode = this.freeNode + (~this.freeNode);//free链里代表
        this.freeEleNum = size;//free链中free节点的数量，用来在compactify中创建free优先队列
        this.refresh();//更新数组，初始化free链
    }
    refresh(){//重置数组，可以重新分配，free链的节点形式是 [后置free空间的数组索引][null][null]
        for(let i = 0; i < this.size; i ++){
            this.setFreeNode(i * 3, (i + 1) * 3);
        }
        this.arr[(this.size - 1) * 3] = this.nullNode;//最后一个节点设置-1，表示后面没有节点了，因为在三个数组空间的第一个放后置节点的地址
        this.free = 0;
        this.freeEleNum = this.size;
    }
    getFree(){
        return this.free;
    }
    setFree(key){//因为compactify遗留问题，用-1表示没有节点了，而其它节点又是正数，free节点又要在最高位放1来保证compactify扫描时知道是不是free节点
        if(this.isNull(key)) this.free = this.nullNode;//-1直接设置-1，-1本身最高位是1
        else this.free = key & (~(this.freeNode));
    }
    setFreeNode(i, x){//注意这里直接设置free节点的值，不进行检查
        this.arr[i] = x | (this.freeNode);
    }
    getFreeNode(i){//这里读取时检查了free节点的值，保证free节点里面放的是-1时，返回-1，compactify方法遗留问题
        var val = this.arr[i];
        if(this.isNull(val)) return val;
        return val & (~(this.freeNode));
    }
    allocate(){//分配一个空间，把this.free指向this.free的后置节点，然后把this.free分配出去，当然是在this.free非-1的情况下，-1了代表没有free空间了
        if(this.isNull(this.free)) return -1;//注意this.free会变成-1，因为是通过getfreenode方法来获取的后置节点
        var a = this.free;
        this.setFree(this.getFreeNode(this.free));//这里有重复的地方，所以java的所有字段建立get和set还是有道理的，建议这样做
        this.freeEleNum --;//当然free元素的数量减一
        return a;
    }
    isNull(key){//确定一个值是否代表是free链中代表结束的值，是否是-1
        return key == this.nullNode;
    }
    isNullNode(i){//读取节点的值确定是否是结束的值，是否是-1
        return this.arr[i] == this.nullNode;
    }
    collect(x){//回收一个空间，通过把x索引的数组元素设置为指向原来的this.free借的，即free链的头节点，注意free链中的指向，是指向后一个元素，free节点的索引，然后this.free指向x即可
        this.setFreeNode(x, this.free);
        this.setFree(x);
        this.freeEleNum ++;
    }
    isFree(key){//compactify遗留问题，原来判断是不是free链中的元素
        return (key & (this.freeNode)) == this.freeNode;
    }
    isFreeNode(i){//compactify遗留问题，判断是不是free节点
        return (this.arr[i] & (this.freeNode)) == this.freeNode;
    }
    compactify(l){ //将链表紧缩，数组的前部如果有空则移动链表节点，这就是那个遗留下诸多问题的compactify，不过是因为优化过所以以前的compactify用东西而现在不需要的就变成遗留问题
        if(!(l instanceof list)) return;
        if(l.eleNum == 0 || this.isNull(this.free)) return;//紧缩数组是指把分配出去，回收回来的反复过程中，分配的空间和free的空间相互夹杂，通过把free空间用链表list的元素占据，原来元素的节点回收保证分配的空间紧紧的占据最前面的空间，所以要保证free空间非空，即free链非空
        var node = l.head;
        var arr = new Array(l.eleNum), i = 0;//这个数组用来放链表的所有节点的索引
        while(node != l.nullNode){
            //str += node + " ";
            arr[i ++] = node;
            node = l.getNext(node);
        }
        var listQue = new priorityQue(arr, i, 1);//这是一个我写的优先队列的实现，建议转到相关文件查看，当成最大二叉堆使用，建立堆需要O(n)时间，找出最大元素需要O(lgn)时间
        arr = new Array(this.freeEleNum);//这个数组用来放所有的free链元素
        i = 0;
        for(node = this.free; node != this.nullNode;){
            arr[i ++] = node;
            node = this.getFreeNode(node);
        }
        var freeQue = new priorityQue(arr, i, 0);//第三个参数是0，最小二叉堆
        i = this.freeEleNum;
        if(l.eleNum < i) i = l.eleNum;
        var rightLimit = listQue.extractRoot().root, prev, next, h = new hashMap(i), leftLimit = freeQue.extractRoot().root;//然后是自己写的很丑的哈希表，只需要free链和链表元素数量的最小值即可，为什么你不明白？因为紧缩不可能超过free链元素数量，不可能超过list元素数量
        while(leftLimit < rightLimit){//紧缩过程开始了，紧缩这个名字感觉不是很好，取出数组最右边的list节点，和数组最左边的free链元素，置换两个元素，要保证list链的顺序不发生改变，只要有最左free链元素在最右list元素的左边就一直置换，当然的是在都有元素的情况下，暂时没写多链表紧缩，如果你有兴趣，可以写所有链表紧缩
           // console.log("这是遍历数组的i和limit", i, limit);
               //console.log("这是数组的free空间", leftLimit, this.arr[leftLimit]);
               //console.log("检查数组：" + this.arr.toString());
                node = rightLimit;//置换的list节点
                h.insert(leftLimit, this.getFreeNode(leftLimit));//先放进哈希表，后面用来整理free链时用，建议修改，我去修改了
                prev = l.getPrev(node);
                next = l.getNext(node);
                l.setKey(leftLimit, l.getKey(node));
                l.setNext(leftLimit, next);
                l.setPrev(leftLimit, prev);
                if(next != l.nullNode){
                    l.setPrev(next, leftLimit);
                }
                if(prev == l.nullNode){
                    l.head = leftLimit;
                }else {
                    l.setNext(prev, leftLimit);
                }
                if(node == l.tail){
                    l.tail = l.setTail(next, prev);
                }
                this.setFreeNode(node, this.free);
                this.setFree(node);
                rightLimit = listQue.extractRoot();
                if(rightLimit.exist) rightLimit = rightLimit.root;
                else break;
                leftLimit = freeQue.extractRoot();
                if(leftLimit.exist) leftLimit = leftLimit.root;
                else break;
        }
        node = this.free;
        prev = this.nullNode;
        var obj;
        i = 0;
        while(node != this.nullNode && i < h.eleNum){
            if((obj = h.get(node)) != null){
                //console.log("obj:", prev, obj);
                i ++;
                if(prev != this.nullNode){
                    this.setFreeNode(prev, obj.ele);
                }else this.setFree(obj.ele);
                node = obj.ele;
            }else {
                prev = node;
                node = this.getFreeNode(node);
            }
        }
        //console.log("压缩了" + h.eleNum + "个元素");
    }
    showFree(){
        if(this.isNull(this.free)) return;
        var arr = new Array(this.size), i = 0, node, str = "";
        for(node = this.free; node != this.nullNode;){
            arr[i ++] = node;
            str += node + " -> "
            //console.log("showfree:",i,node);
            node = this.getFreeNode(node);
            if(i > this.size) throw new Error("free错误");
        }
        console.log(str + "size: " + i);
        var que = new priorityQue(arr, i, 0);
        str = "";
        node = que.extractRoot();
        while(node.exist){
            str += node.root + "  ";
            node = que.extractRoot();
        }
        console.log("showfree(): ",str);
    }
}

class list{
    constructor(arrList){
        if(!(arrList instanceof singleArrList)) throw new Error("参数应该是singleArrList类型");
        this.nullBit = arrList.freeBit - 1;
        this.nullNode = 1 << (this.nullBit - 1);
        this.head = this.nullNode;
        this.listArr = arrList.arr;
        this.obj = arrList;
        this.tail = this.nullNode;
        this.eleNum = 0;
    }
    setTail(...arr){
        this.tail = this.getMaxNode(arr);
    }
    getMaxNode(arr){
        var max = -1;
        for(let i = 0, len = arr.length; i < len; i ++){
            if(arr[i] == this.nullNode) continue;
            if(arr[i] > max) max = arr[i];
        }
        if(max == -1) return this.nullNode;
        else return max;
    }
    checkList(){
        var node = this.head, prev = this.nullNode, i = 0;
        while(node != this.nullNode){
            if(this.getPrev(node) != prev) return false;
            prev = node;
            node = this.getNext(node);
            i ++;
        }
        if(i == this.eleNum) return true;
        return false;
    }
    insert(key){
        var a = this.obj.allocate();
        if(a == -1) return -1;
        this.tail = this.setTail(a, this.tail);
        this.setNext(a, this.head);
        if(this.head != this.nullNode){
            this.setPrev(this.head, a);
        }
        this.head = a;
        this.setKey(a, key);
        this.setPrev(a, this.nullNode);
        this.eleNum ++;
        return 0;
    }
    search(key){
        //console.log(this.listArr);
        //this.show();
        var node = this.head;
        while(node != this.nullNode && this.getKey(node) != key){
            node = this.getNext(node);
        }
        return node;
    }
    delete(key){
        var node = this.search(key);
        if(node != this.nullNode) {
            var prev = this.getPrev(node), next = this.getNext(node);
            if(prev != this.nullNode){
                this.setNext(prev, next);
            }else this.head = next; //只有头结点的前置节点为空
            if(next != this.nullNode){
                this.setPrev(next, prev);
            }
            if(this.tail == node) {
                this.tail = this.setTail(prev, next);
                //this.setMaxTail(prev, next);
            }
            this.obj.collect(node);
            this.eleNum --;
            return 0;
        }
        return -1;
    }
    compactDelete(key){//紧缩的删除元素 
        var node = this.search(key);
        if(node != this.nullNode) {//如果找到节点
            var prev = this.getPrev(node), next = this.getNext(node);//prev代表节点的前置节点， next是节点的后置节点
            if(prev != this.nullNode){//有前置节点，让前置节点prev的后置节点地址指向node节点的后置节点next
                this.setNext(prev, next);
            }else this.head = next;//如果没有前置节点，说明是头结点，删除元素要改变链表头部的指向
            if(next != this.nullNode) this.setPrev(next, prev);//先使node节点的后置节点next的前置节点地址指向node节点的前置节点prev
            if(node == this.tail){//如果是删除尾节点，要改变尾链表部的指向，不用考虑后置节点
                //this.setMaxTail(prev, next);
                this.tail = this.setTail(prev, next);
            }else{//否则有后置节点，要考虑后置节点的处理，并且要进行压缩链表数组的处理
                if(this.tail != this.nullNode && node < this.tail){//如果空缺的地方在尾部的前面，才进行压缩处理
                    prev = this.getPrev(this.tail);//prev指向尾节点的前置节点
                    next = this.getNext(this.tail);
                    if(prev == this.nullNode){//如果尾节点没有前置节点，说明只剩下一个节点，直接进行复制并将node指向尾节点释放即可
                        this.head = node;//只有一个节点，改变头结点指向
                    }else this.setNext(prev, node);
                    if(next != this.nullNode) this.setPrev(next, node); 
                    this.setKey(node, this.getKey(this.tail));//复制尾节点到node处
                    this.setPrev(node, prev);
                    this.setNext(node, next);
                    var max = node;
                    node = this.tail;
                    this.tail = this.setTail(prev, next, max);
                    //this.setMaxTail(prev, next, max);
                    //this.tail = prev;
                    // console.log(this.tail)
                    // if(next > prev) this.tail = next;
                    // console.log(this.tail)
                    // if(max > this.tail) this.tail = max;
                    // console.log(this.tail)
                }
            }
            this.obj.collect(node);
            this.eleNum --;
            return 0;
        }
        return -1;
    }
    show(){
        var str = "", node = this.head;
        while(node != this.nullNode){
            str += this.getKey(node) + " -> "
            node = this.getNext(node);
        }
        console.log(str + "size: " + this.eleNum);
    }
    reverse(){//反转链表
        var node = this.head, prev = this.nullNode, next, max = -1;
        while(node != this.nullNode){
            if(node > max) max = node;
            prev = this.getPrev(node);
            next = this.getNext(node);
            //console.log(node, next, prev)
            this.setNext(node, prev);
            this.setPrev(node, next);
            node = next;
        }
        if(this.max != -1) this.tail = max
        if(prev != this.nullNode) this.head = this.getPrev(prev);
    }
    freeList(){//释放整个链表
        var node = this.head;
        while(node != this.nullNode){
            this.obj.collect(node);
            node = this.getNext(node);
        }
        this.head = this.nullNode;
        this.eleNum = 0;
        this.tail = this.nullNode;
    }
    setNext(a, b){
        this.listArr[this.getNextLoc(a)] = b;
    }
    setKey(a, key){
        this.listArr[this.getKeyLoc(a)] = key;
    }
    setPrev(a, b){
        this.listArr[this.getPrevLoc(a)] = b;
    }
    getNext(a){
        return this.listArr[this.getNextLoc(a)];
    }
    getKey(a){
        return this.listArr[this.getKeyLoc(a)];
    }
    getPrev(a){
        return this.listArr[this.getPrevLoc(a)];
    }
    getKeyLoc(loc){//数组的分配以三个数组空间为一个单位，形式是[前置节点的数组索引][键值][后置节点的数组索引]
        return loc + 1;
    }
    getPrevLoc(loc){
        return loc;
    }
    getNextLoc(loc){
        return loc + 2;
    }
}


var random = Math.random, floor = Math.floor;
class priorityQue{
    constructor(arr, eleNum, type = 0){
        if(!(arr instanceof Array) || eleNum == undefined || eleNum > arr.length || eleNum < 0)  throw new Error("请输入正确参数");
        this.heap = arr;
        this.eleNum = eleNum;//elenum指元素的数目，用elenum访问数组时，要进行下标处理，即减一
        this.type = type; //0最小堆 1最大堆
        this.buildHeap(arr, eleNum);
    }
    buildHeap(heap, size){//从n/2处向下更新，因为定理从0到n/2都有子节点，所以只要保证这些节点的子节点较大即可
        for(let i = floor(size / 2) - 1; i >= 0; i --){
            this.renewDown(i, heap[i]);
        }
    }
    getRoot(){
        if(this.eleNum == 0) return {
            exist: false
        }
        return {
            exist: true,
            root: this.heap[0]
        };
    }
    extractRoot(){//删除根节点
        if(this.eleNum == 0) return {
            exist: false,
            root: null
        };
        var root = this.heap[0], key = this.heap[-- this.eleNum];
        this.renewDown(0, key);
        return {
            exist: true,
            root: root
        };
    }
    changeKey(i, key){//
        if(i == undefined || key == undefined) throw new Error("请输入参数");
        if(i >= this.eleNum || i < 0) throw new Error("请输入正确索引值");

        //原来 this.heap[i] <= key 
        if(this.changeCheck(this.heap[i], key)) return -1;

        this.renewUp(i, key);
        return 0;
    }
    changeCheck(a, b){
        var result = a <= b;
        if(this.type == 1) return a >= b;//最大堆检查
        return result;
    }
    insert(key){//插入一个值
        if(this.eleNum == this.heap.length) return -1;
        if(key == undefined) throw new Error("请输入参数");
        this.renewUp(this.eleNum ++, key);
        return 0;
    }
    toString(){
        var str = "[";
        for(let i = 0; i < this.eleNum; i++){
            str += this.heap[i] + ", "
        }
        str += "size: " + this.eleNum + "]";
        console.log(str);
    }
    deleteEle(i){//删除元素
        if(i == undefined || i > this.eleNum - 1 || i < 0) throw new Error("元素不存在"); //保证i值正确性
        if(this.eleNum == 0) return -1;
        this.eleNum --;//因为删除一个元素，二叉堆大小减一，数组不做变化
        if(i == this.eleNum) return 0;//如果删除的元素等于最后一个元素则返回，注意这里size是已经减一的size
        var key = this.heap[this.eleNum];//key等于size没减之前的二叉堆的最后一个元素
        var j = i + 1, left = 2 * j, right = left + 1, max, min, b1, b2;
        if(left <= this.eleNum){
            b1 = this.heap[left - 1];
            if(right <= this.eleNum) {
                b2 = this.heap[right - 1];
                max = b2; 
                min = b1;
                if(b1 > b2) [max, min] = [b1, b2];
            }
            else {
                max = min = b1;
            }
        }else{
            this.renewUp(i, key);//如果没有子节点，则直接向上更新
            return;
        }
        if(key < min){//如果小于子节点，向上更新
            if(this.type == 1) this.renewDown(i, key);
            else this.renewUp(i, key);
        }else if(key > max){//否则大于子节点，向下更新
            if(this.type == 1) this.renewUp(i, key);
            else this.renewDown(i, key);
        }else{
            let node;
            node = left - 1;
            if(this.type == 1) {
                if(b1 < b2) node = right - 1;
            }else if(b1 > b2) node = right - 1;
            this.heap[i] = this.heap[node];
            this.heap[node] = key;
        }
        return 0;
    }
    renewUp(i, key){//二叉堆向上更新
        for(let j = i + 1, parent; j > 1;){
            parent = floor(j / 2);
            
            //this.heap[parent - 1] > key 
            if(this.renewUpCheak(this.heap[parent - 1], key)){
                this.heap[j - 1] = this.heap[parent - 1];
            }else {
                this.heap[j - 1] = key;//j节点等于key值
                return;//退出
            }
            j = parent;
        }
        this.heap[0] = key;
    }
    renewUpCheak(a, b){
        var result = a > b;
        if(this.type == 1) return a < b;
        return result;
    }
    renewDown(i, key){//二叉堆向下更新
        var node = i + 1;
        for(let j = node, limit = floor(this.eleNum / 2), left, right; j <= limit;){ 
            left = 2 * j;
            right = left + 1;
            node = left;
            if(right <= this.eleNum) {
                if(this.type == 1) node = right;
                if(this.heap[left - 1] > this.heap[right - 1]) {
                    if(this.type == 1) node = left;
                    else node = right;
                }
            }

            //key <= this.heap[node - 1] 
            if(this.renewDownCheck(key, this.heap[node - 1])){
                this.heap[j - 1] = key;
                return;
            }
            this.heap[j - 1] = this.heap[node - 1];
            j = node;
        }
        this.heap[node - 1] = key; //没有子节点了直接给这个节点赋值
    }
    renewDownCheck(a, b){
        var result = a <= b;
        if(this.type == 1) return a >= b;
        return result;
    }
    toStringByLine(){//打印二叉堆
        var size = this.eleNum, str = "", i = 0, bottom = floorlog(size, 2), space = this.getRandomMaxLeaf(3) + 4;//space代表一个我们最小单位的放下元素的位数
        bottom = 1 << bottom;//bottom变量代表二叉堆最后一行的最大叶子数，在后面用作每行空格的份额
        var strspace = "";
        for(let i = 0; i < space; i ++) strspace += " ";//构造最小单位的空格
        for(let limit = 2; limit - 1 <= size; limit <<= 1){//从上往下依次打印二叉堆，limit 代表完全二叉树的最大元素数量 等于2^h - 1，h代表树高，因为使用二的幂分割元素，所以最后一行额外用循环打印
            while(i < limit - 1){//因为数组以0开头，所以没有等于
                str += this.heap[i ++];//字符串添加元素，然后再i加一
                if(i < limit - 1){//判断后一个元素是否是本行元素，如果是就要添加空格分割，与后一个元素分开
                    let a = computeDigit(this.heap[i - 1]), b = 1;//保证对齐，用a变量记录字符串添加的i-1元素的位数，注意i已经加了一，代表后一个元素的索引，所以要减一，
                    while(b * space < a) b ++;//然后如果一个单位空格的位数不够放下i-1元素，多用几个单位空格装
                    for(let i = 0; i < b * space - a; i ++) str += " ";//开始填充空格，保证i-1元素的位数加上填充的空格等于b个单位空格
                    for(let i = b; i < bottom; i ++) str += strspace;//在最后一行一个单位空格装一个元素，其它行保证父母节点在左子节点上方对齐，即设h为某一行，则h-1行的节点比h行元素少一半，因为第h行的两个节点连接一个父母节点，把h-1行的父母节点放在h行左子节点上方后，用单位空格填充后，保证下一个父母节点在其左子节点上方
                    if(b >= bottom && b * space == a) str += " ";//如果刚好用完一行的单位空格份额，则添加一个小空格做分割
                }
            }
            str += "\n";//换下一行
            bottom /= 2;//因为自顶向下，所以往下空格份额减半
        }
        while(i < size) {//打印剩下的元素
            str += this.heap[i ++];
            let a = computeDigit(this.heap[i - 1]), b = 1;
            while(b * space < a) b ++;
            for(let i = 0; i < b * space - a; i ++) str += " ";
            if(b*space == a) str += " ";
        }
        console.log(str);
    }
    getRandomMaxLeaf(j){//在随机的j个叶子元素中，寻找一个尽量较大的位数 ，因为二叉堆的叶子元素在size/2后，size为二叉堆的大小
        var max = 0;
        for(let i = 0, box, a = floor(this.eleNum / 2), b = this.eleNum - a; i < j; i ++){
            box = computeDigit(this.heap[floor(random() * b) + a]);
            if(box > max) max = box;
        }
        return max;
    }
}
function swap(arr, a, b){
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
function floorlog(num, log){//向下取整的log
    var i;
    for(i = 0, count = log; count <= num; i ++){
        count *= log;
    }
    return i;
}
function computeDigit(num){ //计算数字的位数，负数则多一个负号位
    if(num >= 0){
        var i;
        for(i = 1, count = 10; count <= num; i ++){
            count *= 10;
        }
        return i;
    }else{
        var i;
        for(i = 1, count = -10; count >= num; i ++){
            count *= 10;
        }
        return i + 1;
    }
}

class hashMap{
    constructor(size){
        this.arr = new Array(size).fill({
            val: -1,
            ele: null
        });
        this.size = size;
        this.eleNum = 0;
        this.other = null;
    }
    insert(val, ele){
        var key = this.hash(val);
        if(this.arr[key].val != -1){
            var obj = this.getObj(val, ele);
            obj.next = this.other;
            this.other = obj;
        }else {
            this.arr[key].val = val;
            this.arr[key].ele = ele;
        }
        this.eleNum++;
    }
    delete(val){
        var key = this.hash(val);
        if(this.arr[key].val == val){
            this.arr[key].val = -1;
        }else{
            var node = this.other, prev = null;
            while(node != null && node.key != val){
                prev = node;
                node = node.next;
            }
            if(node == null) return -1;
            if(prev == null) this.other = node.next;
            prev.next = node.next;
        }
        this.eleNum--;
        return 0;
    }
    has(val){
        var key = this.hash(val);
        if(this.arr[key].val != val){
            var node = this.other;
            while(node != null && node.key != val){
                node = node.next;
            }
            if(node == null) return false;
        }
        return true;
    }
    get(val){
        var key = this.hash(val);
        if(this.arr[key].val != val){
            var node = this.other;
            while(node != null && node.key != val){
                node = node.next;
            }
            if(node == null) return null;
            else return {
                val: node.key,
                ele: node.ele
            }
        }
        return this.arr[key];
    }
    show(){
        var str = "";
        var node = this.other;
        while(node != null){
            str += node + " -> ";
            node = node.next;
        }
        console.log(str);
    }
    hash(val){
        return floor(val/3) % this.size;
    }
    getObj(val, ele){
        return {
            key: val,
            ele: ele,
            next: null
        }
    }
}

var a,l;
function test1(){
    a = new singleArrList(10);
    l = new list(a);
    var arr = new Array(300), insert = new priorityQue(new Array(300), 0, 1);
    for(let i = 0; i < 300; i ++) arr[i] = floor(random() * 1000000);
    var step = 0, check;
    while(step < 100){
        for(let i = 0, num; i < 12; i ++){
            if(floor(random() * 2) != 0){
                num = floor(random()*300);
                if(l.insert(arr[num]) == 0){
                    insert.insert(arr[num]);
                }
            }else{
                num = insert.extractRoot();
                if(num.exist){
                   // console.log(a.arr.toString(), l.checkList(), l.head, l.eleNum,l.tail);
                    //console.log("delete",num.root)
                    if(floor(random() * 3) != 0) l.compactDelete(num.root);
                    else l.delete(num.root);
                    //console.log(a.arr.toString(), l.checkList())
                    //l.show();
                    if(l.checkList() == false) throw new Error("checkerror");
                }
            }
        }
        //console.log("这是压缩前的数组", a.arr.toString());
        //l.show();
        //insert.toStringByLine()
        if(floor(random() * 4) != 0){
            //a.showFree();
            a.compactify(l);
            //a.showFree();
        }
        //console.log("这是压缩后的数组",  a.arr.toString())
        //l.show();
        check = l.checkList();
        console.log(step, check);
        if(check) step ++;
        else break;
    }
    return {
        a: a,
        l: l
    }
}
//test1();
function test2(){
    var a = new singleArrList(100), l = new list(a), arr = new Array(300), insert = new priorityQue(new Array(300), 0, 1);
    for(let i = 0; i < 300; i ++) arr[i] = floor(random() * 1000000);
    var step = 0, check;
    while(step < 100){
        for(let i = 0, num; i < 100; i ++){
            if(floor(random() * 2) != 0){
                num = floor(random()*300);
                if(l.insert(arr[num]) == 0){
                    insert.insert(arr[num]);
                }
            }else{
                num = insert.extractRoot();
                if(num.exist){
                    l.delete(num.root);
                }
            }
        }
        step ++;
    }
    a.showFree();
    a.compactify(l);
    a.showFree();
    check = l.checkList();
    console.log(step, check);
    return {
        a: a,
        l: l
    }
}
function test3(){
    var a = new singleArrList(100), arr = new Array(300), insert1 = new priorityQue(new Array(100), 0, 1), insert2 = new priorityQue(new Array(100), 0, 1);
    var l1 = new list(a), l2 = new list(a);
    for(let i = 0; i < 300; i ++) arr[i] = floor(random() * 1000000);
    var step = 0, check1, check2;
    while(step < 100){
        for(let i = 0, num; i < 200; i ++){
            num = floor(random()*300);
            if(floor(random() * 2) != 0){
                if(l1.insert(arr[num]) == 0){
                    insert1.insert(arr[num]);
                }
            }else{
                if(l2.insert(arr[num]) == 0){
                    insert2.insert(arr[num]);
                }
            }
            
            if(floor(random() * 2) == 0){
                if(floor(random() * 2) != 0){
                    num = insert2.extractRoot();
                    if(num.exist){
                        if(floor(random() * 3) != 0) l2.compactDelete(num.root);
                        else l2.delete(num.root);
                    }
                }else{
                    num = insert1.extractRoot();
                    if(num.exist){
                        if(floor(random() * 3) != 0) l1.compactDelete(num.root);
                        else l1.delete(num.root);
                    }
                }
            }
        }
        if(floor(random() * 3) == 0) l1.reverse();
        if(floor(random() * 3) == 0) l2.reverse();
        if(floor(random() * 4) == 0) a.compactify(l1);
        if(floor(random() * 4) == 0) a.compactify(l2);
        check1 = l1.checkList();
        check2 = l2.checkList();
        if(check1 && check2)  step ++;
        else throw new Error("false");
    }
    console.log("true")
}
test3();