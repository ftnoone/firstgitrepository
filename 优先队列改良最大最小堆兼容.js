var random = Math.random, floor = Math.floor;
class priorityQue{
    constructor(arr, eleNum, type = 0, eleType = 0){
        if(!(arr instanceof Array) || eleNum == undefined || eleNum > arr.length || eleNum < 0)  throw new Error("请输入正确参数");
        this.heap = arr;
        this.eleNum = eleNum;//elenum指元素的数目，用elenum访问数组时，要进行下标处理，即减一
        this.type = type; //0最小堆 1最大堆
        this.eleType = eleType;//元素类型，引用类型还是基本类型
        this.buildHeap(arr, eleNum);
    }
    buildHeap(heap, size){//从n/2处向下更新，因为定理从0到n/2都有子节点，所以只要保证这些节点的子节点较大即可
        for(let i = floor(size / 2) - 1; i >= 0; i --){
            this.renewDown(i, heap[i]);
        }
    }
    getKey(i){
        if(this.eleType == 0) return this.heap[i];
        return this.heap[i].key;
    }
    setKey(i, key){
        if(this.eleType == 0) this.heap[i] = key;
        else this.heap[i].key = key;
    }
    setNode(i, ele){
        this.heap[i] = ele;
    }
    getNode(i){
        return this.heap[i];
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