var random = Math.random, floor = Math.floor;
class maxFirstQue{
    constructor(arr, getKey, getEle){
        this.heap = arr;
        this.size = arr.length;
        this.getKey = getKey;
        this.getEle = getEle;
        this.buildMinHeap(arr, this.size);
    }
    get(index){
        return this.heap[index];
    }
    buildMinHeap(heap, size){//从n/2处向下更新，因为定理从0到n/2都有子节点，所以只要保证这些节点的子节点较大即可
        for(let i = floor(size / 2) - 1; i >= 0; i --){
            this.renewDown(i, heap[i]);
        }
    }
    minimum(){
        return this.heap[0];
    }
    extractMinimum(){//删除根节点，即最小的元素
        var min = this.heap[0], node = this.heap[-- this.size];
        this.renewDown(0, node);
        return min;
    }
    decreaseKey(i, key){//减小节点的值
        if(i == undefined || key == undefined) throw new Error("请输入参数");
        if(i >= this.size || i < 0) throw new Error("请输入正确索引值");
        if(this.getKey[i] <= key) throw new Error("输入权值大于等于原本权值");
        this.renewUp(i, key);
    }
    minInsert(key){//插入一个值
        if(key == undefined) throw new Error("请输入参数");
        this.renewUp(this.size ++, key);
    }
    toString(){
        var str = "[";
        for(let i = 0; i < this.size; i++){
            str += this.getKey(this.heap[i]) + ", "
        }
        str += "size: " + this.size + "]";
        console.log(str);
    }
    deleteEle(i){//删除元素
        if(i == undefined || i > this.size - 1 || i < 0) throw new Error("元素不存在"); //保证i值正确性
        this.size --;//因为删除一个元素，二叉堆大小减一，数组不做变化
        if(i == this.size) return;//如果删除的元素等于最后一个元素则返回，注意这里size是已经减一的size
        var node = this.heap[this.size], key = this.getKey(node);//key等于size没减之前的二叉堆的最后一个元素
        var j = i + 1, left = 2 * j, right = left + 1, max, min, b1, b2;//min放最小的子节点，max放最大的子节点，b1b2存放子节点值
        if(left <= this.size){//如果有子节点，找到最小的一个节点
            b1 = this.getKey(this.heap[left - 1]);
            if(right <= this.size) {
                b2 = this.getKey(this.heap[right - 1]);
                max = b2; 
                min = b1;
                if(b1 < b2) [max, min] = [b1, b2];
            }
            else {
                max = min = b1;
            }
        }else{
            this.renewUp(i, node);//如果没有子节点，则直接向上更新
            return;
        }
        if(key > min){//如果小于子节点，向上更新
            this.renewUp(i, node);
        }else if(key < max){//否则大于子节点，向下更新
            this.renewDown(i, node);
        }else{//否则把最小的子节点放到i处，然后把key值放到子节点处
            let max = b1 > b2 ? left - 1 : right - 1;//min转换为索引
            this.heap[i] = this.heap[max];
            this.heap[max] = node;
        }
    }
    renewUp(i, node){//最小二叉堆向上更新
        for(let j = i + 1, parent, key = this.getKey(node); j > 1;){//要将数组的从0开始的索引转换为二叉树从1开始的索引，所以j等于i加一；在二叉树索引中节点1是根节点，没有父节点了，跳出循环
            parent = floor(j / 2);//定理：在完全二叉树中（二叉堆就是完全二叉树），给定i索引的父节点等于i除以二向下取整
            if(this.getKey(this.heap[parent - 1]) < key){//如果父节点值大于key值
                this.heap[j - 1] = this.heap[parent - 1];//j节点等于父节点的值
            }else {//否则说明已经完成更新任务（最小二叉堆中每个父节点永远小于子节点），不用向上了
                this.heap[j - 1] = node;//j节点等于key值
                return;//退出
            }
            j = parent;//j等于父节点索引继续向上更新
        }
        this.heap[0] = node;
    }
    renewDown(i, node){//最小二叉堆向下更新
        var max;
        for(let j = i + 1, limit = floor(this.size / 2), left, right, key = this.getKey(node); j <= limit;){ //要将数组的从0开始的索引转换为二叉树从1开始的索引，所以j等于i加一；limit为二叉堆的最后一个节点的父节点，如果有子节点，则这个节点的索引必然小于等于limit，否则没有子节点，直接退出循环
            left = 2 * j;//给定完全二叉树的节点的i索引，左子节点是2i，右子节点为2i + 1, 转换到数组要减一，因为数组从0开始
            right = left + 1;
            if(right <= this.size) max = this.getKey(this.heap[left - 1]) > this.getKey(this.heap[right - 1]) ? left : right;//找到子节点中的最小元素
            else max = left;
            if(key >= this.getKey(this.heap[max - 1])){//如果key值小于等于这个子节点最小的值，就不向下更新
                this.heap[j - 1] = node;//直接把key值赋值给j节点
                return;
            }
            this.heap[j - 1] = this.heap[max - 1];//否则j节点赋值为最小子节点的值
            j = max;//然后j等于最小的字节点索引
        }
        this.heap[max - 1] = node; //没有子节点了直接给这个节点赋值
    }
    toStringByLine(){//打印二叉堆
        var size = this.size, str = "", i = 0, bottom = floorlog(size, 2), space = this.getRandomMaxLeaf(3) + 4;//space代表一个我们最小单位的放下元素的位数
        bottom = 1 << bottom;//bottom变量代表二叉堆最后一行的最大叶子数，在后面用作每行空格的份额
        var strspace = "";
        for(let i = 0; i < space; i ++) strspace += " ";//构造最小单位的空格
        for(let limit = 2; limit < size; limit <<= 1){//从上往下依次打印二叉堆，limit 代表完全二叉树的最大元素数量 等于2^h - 1，h代表树高，因为使用二的幂分割元素，所以最后一行额外用循环打印
            while(i < limit - 1){//因为数组以0开头，所以没有等于
                str += this.getKey(this.heap[i ++]);//字符串添加元素，然后再i加一
                if(i < limit - 1){//判断后一个元素是否是本行元素，如果是就要添加空格分割，与后一个元素分开
                    let a = computeDigit(this.getKey(this.heap[i - 1])), b = 1;//保证对齐，用a变量记录字符串添加的i-1元素的位数，注意i已经加了一，代表后一个元素的索引，所以要减一，
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
            str += this.getKey(this.heap[i ++]);
            let a = computeDigit(this.getKey(this.heap[i - 1])), b = 1;
            while(b * space < a) b ++;
            for(let i = 0; i < b * space - a; i ++) str += " ";
            if(b*space == a) str += " ";
        }
        console.log(str);
    }
    getRandomMaxLeaf(j){//在随机的j个叶子元素中，寻找一个尽量较大的位数 ，因为二叉堆的叶子元素在size/2后，size为二叉堆的大小
        var max = 0;
        for(let i = 0, box, a = floor(this.size / 2), b = this.size - a; i < j; i ++){
            box = computeDigit(this.getKey(this.heap[floor(random() * b) + a]));
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

function createIndexMaxHeapByNewArr(arr){
    let len = arr.length, newArr = new Array(len), i;
    for(i = 0; i < len; i ++) newArr[i] = {
        key: arr[i]*i,
        ele: i,
        height: arr[i]
    };
    return new maxFirstQue(newArr, (a)=>a.key, (a)=>a.ele);
}