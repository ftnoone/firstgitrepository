class btree{
    constructor(degree){
        this.degree = degree || 2;//b树的度degree >= 2;
        if(this.degree < 2) return null;
        this.root = null;
        this.height = 0;
        this.eleNum = 0;
    }
    split(node, index){
        var j;
        for(j = node.n; j >= index; j --){
            node.children[j + 1] = node.children[j];
        }
        for(j = node.n - 1; j >= index; j --){
            node.keys[j + 1] = node.keys[j];
        }
        var temp = new btreeNode(2*this.degree), child = node.children[index];
        temp.ifLeaf = child.ifLeaf;
        for(j = 0; j < this.degree - 1; j ++){
            temp.keys[j] = child.keys[j + this.degree];
        }
        if(!child.ifLeaf) for(j = 0; j < this.degree; j ++){
            temp.children[j] = child.children[j + this.degree];
        }
        child.n = this.degree - 1;
        temp.n = this.degree - 1;
        node.children[index + 1] = temp;
        node.keys[index] = child.keys[this.degree - 1]; 
        node.n ++;
        this.writeDisk(node);
        this.writeDisk(temp);
        this.writeDisk(child);
    }
    insert(key){
        if(this.root == null) {
            this.root = this.createNode();
            this.height ++;
        }
        var node = this.root, n, num;
        if(node.n == 2*this.degree - 1){
            var temp = this.createNode();
            temp.ifLeaf = false;
            this.root = temp;
            temp.children[0] = node;
            this.split(temp, 0);
            node = temp;
            this.height ++;
        }
        while(true){
            n = node.n;
            if(node.ifLeaf){
                for(n --; n >= 0; n --){
                    if(key > node.keys[n]) break;
                    node.keys[n + 1] = node.keys[n];
                }
                node.keys[n + 1] = key;
                node.n ++;
                this.writeDisk(node);
                break;
            }else{
                num = treeBinarySearch(node.keys, key, 0, n - 1);
                this.readDisk(node.children[num]);
                if(node.children[num].n == 2*this.degree - 1) {
                    this.split(node, num);
                    if(key > node.keys[num]) num ++;
                }
                node = node.children[num];
            }
        }
        this.eleNum ++;
    }
    delete(key){
        var node = this.root, num, box, temp;
        if(node.n == 0) return;
        num = treeBinarySearch(node.keys, key, 0, node.n - 1);
        while(node){
            box = node.children;
            if(num < node.n && node.keys[num] == key){ //算法导论3版287页
                if(node.ifLeaf){//情况1
                    //console.log("condition1", num, "key: " + key, "delete: " + node.keys[num]);
                    for(let i = num; i < node.n - 1; i ++){
                        node.keys[i] = node.keys[i + 1];
                    }
                    node.n --;
                    this.eleNum --;
                    //this.show();
                    return true;
                }else{//情况2
                    if(box[num].n >= this.degree){//2a
                        //console.log("condition2a", num, box[num].n, "key: " + key, "delete: " + node.keys[num]);
                        key = node.keys[num] = this.precusorInSubTree(node, num);
                        node = box[num];
                        num = treeBinarySearch(node.keys, key, 0, node.n - 1);
                    }else if(num < node.n && box[num + 1].n >= this.degree){//2b
                        //console.log("condition2b", num, box[num + 1].n, "key: " + key, "delete: " + node.keys[num]);
                        key = node.keys[num] = this.succeedInSubTree(node, num);
                        node = box[num + 1];
                        num = treeBinarySearch(node.keys, key, 0, node.n - 1);
                    }else{//2c
                        //console.log("condition2c", num, "key: " + key, "delete: " + node.keys[num]);
                        temp = box[num].n;
                        this.mergeR(node, num);
                        node = box[num];
                        num = temp;
                    }
                }
            }else{
                if(node.ifLeaf) {
                    //console.log(key, num, node);
                    //this.show();
                    return false;
                }
                if(box[num].n < this.degree){//情况三
                    temp = box[num].n;
                    if(num < node.n && box[num + 1].n >= this.degree){//3a
                        //console.log("condition3a", num, box[num + 1].n, "key: " + key);
                        box[num].keys[temp] = node.keys[num];
                        node.keys[num] = box[num + 1].keys[0];
                        box[num].children[temp + 1] = box[num + 1].children[0];
                        let limit = box[num + 1].n;
                        for(let i = 0; i < limit - 1; i ++){
                            box[num + 1].keys[i] = box[num + 1].keys[i + 1];
                            box[num + 1].children[i] = box[num + 1].children[i + 1];
                        }
                        box[num + 1].children[limit - 1] = box[num + 1].children[limit];
                        box[num].n ++;
                        box[num + 1].n --;
                    }else if(num > 0 && box[num - 1].n >= this.degree){//3a
                        //console.log("condition3a2", num, box[num - 1].n, "key: " + key);
                        let limit = box[num - 1].n;
                        for(let i = temp; i > 0; i --){
                            box[num].keys[i] = box[num].keys[i - 1];
                            box[num].children[i + 1] = box[num].children[i]; 
                        }
                        box[num].children[1] = box[num].children[0];
                        box[num].keys[0] = node.keys[num - 1];
                        node.keys[num - 1] = box[num - 1].keys[limit - 1];
                        box[num].children[0] = box[num - 1].children[limit];
                        box[num].n ++;
                        box[num - 1].n --;
                    }else {//3b
                        //console.log("condition3b", num, "key: " + key);
                        if(num < node.n){
                            this.mergeR(node, num);
                        }else{
                            this.mergeR(node, -- num);
                        }
                    }
                }
               // else console.log("none", num, "key: " + key)
                node = box[num];
                num = treeBinarySearch(node.keys, key, 0, node.n - 1);
            }
        }
        this.show();
        return false;
    }
    precusorInSubTree(node, num){
        node = node.children[num];
        while(!node.ifLeaf){
            node = node.children[node.n];
        }
        return node.keys[node.n - 1];

    }
    succeedInSubTree(node, num){
        node = node.children[num + 1];
        while(!node.ifLeaf){
            node = node.children[0];
        }
        return node.keys[0];
    }
    mergeR(node, num){//合并num和num右边的子孩子
        var box = node.children, base = box[num].n, limit = box[num + 1].n;
        box[num].keys[base ++] = node.keys[num];
        for(let i = 0; i < limit; i ++){
            box[num].keys[base + i] = box[num + 1].keys[i];
            box[num].children[base + i] = box[num + 1].children[i];
        }
        box[num].children[base + limit] = box[num + 1].children[limit];
        box[num].n += limit + 1;
        for(let i = num; i < node.n - 1; i ++) {
            node.keys[i] = node.keys[i + 1];
            node.children[i + 1] = node.children[i + 2];
        }
        node.n --;
        if(node.n == 0 && node == this.root) this.root = box[num];
    }
    search(key){
        var node;
        if(this.root instanceof btreeNode) node = this.root;
        else return null;
        var index;
        while(true){
            index = treeBinarySearch(node.keys, key, 0, node.n);
            if(index != node.n && key == node.keys[index]) return {node, index};
            else if(node.ifLeaf) return null;
            node = node.children[index];
        }
    }
    readDisk(node){

    }
    writeDisk(node){

    }
    createNode(){
        return new btreeNode(this.degree*2);
    }
    show(){
        var node = this.root, num = 1;
        function print(node, q){
            var str = "";
            for(let i = 0; i < node.n; i ++) str += node.keys[i] + ", ";
            if(node.ifLeaf) ;
            else for(let i = 0; i <= node.n; i ++) q.enqueue(node.children[i]);
            return str;
        }
        var str = "", q = new queue(num * this.degree * 2), next;
        q.enqueue(node);
        while(true){
            next = new queue(num * this.degree * 2 + 1);
            while(!q.isEmpty()) {
                str += print(node = q.dequeue(), next) + " next-> ";
            }
            console.log(str);
            if(node.ifLeaf) return;
            str = "";
            num = next.getNum();
            q = next;
        }
    }
    check(){
        if(this.root != null){
            var node = this.root, s = new stack(this.height), index = 0, prior, rear, count = 0, obj, last = false, height = 1;
            while(true){
                for(let i = 0; i < node.n - 1; i ++) if(node.keys[i + 1] < node.keys[i]) {
                    console.log("1: 大小顺序错误", node);
                    return false;
                }
                count += node.n;
                if(node != this.root && node.n >= this.degree - 1 && node.n <= 2*this.degree - 1){
                    if(index != 0 && node.keys[0] < prior) {
                        console.log("2: 孩子的最小元素小于前父元素", node, prior, s.pop(), index);
                        return false;
                    }
                    if(!last && node.keys[node.n - 1] > rear) {
                        console.log("3: 孩子的最大元素大于后父元素", node, rear, s.pop(), last);
                        return false;
                    }
                }
                if(!node.ifLeaf) {
                    index = 0;
                    s.push({
                        node: node,
                        index: index
                    });
                    rear = node.keys[index];
                    node = node.children[index];
                    last = false;
                    height ++;
                }
                else{
                    do{
                        if(s.isEmpty()) {
                            if(count != this.eleNum) {
                                console.log("4: 计数错误", count, this.eleNum);
                                return false;
                            }
                            if(height != 1){
                                console.log("5: 高度错误", height, this.height);
                                return false;
                            }
                            return true;
                        }
                        obj = s.pop();
                        height --;
                        if(height < 0){
                            console.log("6: 高度错误", height, this.height);
                            return false;
                        }
                    }while(obj.index == obj.node.n)
                    index = obj.index + 1;
                    s.push({
                        node: obj.node,
                        index: index
                    })
                    height ++;
                    if(height > this.height){
                        console.log("7: 高度错误", height, this.height);
                        return false;
                    }
                    prior = obj.node.keys[index - 1];
                    if(index < obj.node.n) rear = obj.node.keys[index];
                    if(index == obj.node.n) last = true;
                    node = obj.node.children[index];
                }
            }
        }
    }
}

function testSmall(){
    var b = new btree(5), num = 20, s = new stack(num), box;
    for(let i = 0; i < num; i ++) {
        box = random(num * 10);
        b.insert(box);
        s.push(box)
    }
    for(let i = 0; i < floor(num / 2); i ++){
        if(!b.delete(s.pop())) {
            console.log(b)
            return false;
        }
    }
    return true;
}

class btreeNode{
    constructor(size){
        this.keys = new Array(size);
        this.children = new Array(size);
        this.ifLeaf = true;
        this.n = 0;
    }
}
function binarySearch(arr, key, start, end){
    var middle;
    while(start < end){
        middle = Math.floor((end + start) / 2);
        if(key == arr[middle]) return middle;
        else if(key > arr[middle]) start = middle + 1;
        else end = middle - 1;
    }
    if(arr[start] == key) return start;
    else return -1;
}
function treeBinarySearch(arr, key, start, end){
    var middle;
    while(start < end){
        middle = Math.floor((end + start) / 2);
        if(key == arr[middle]) return middle;
        else if(key > arr[middle]) start = middle + 1;
        else end = middle - 1;
    }
    if(key > arr[start]) return start + 1;
    else return start;
}
var arr = [1,5,4,2135,486,312,135,15,132,8,64,1,21,,12,1,4,42,12,45,45,23,23,1];
arr.sort((a, b) => a - b);
treeBinarySearch(arr, 5, 0, arr.length - 1);

var floor = Math.floor;
function random(n){
    return floor(Math.random() * n);
}
function testBinarySearch(){
    var arr = new Array(2000), i;
    for(i = 0; i < arr.length; i ++) arr[i] = random(400000);
    arr.sort((a, b) => a - b);
    var bin;
    for(i = 0; i < arr.length; i ++){
        if((bin = binarySearch(arr, arr[i], 0, arr.length - 1)) != i) {
            if(arr[bin] == arr[i]) continue;
            return false;
        }
    }
    return true;
}
function testTreeBinarySearch(){
    var arr = new Array(2000), i;
    for(i = 0; i < arr.length; i ++) arr[i] = random(400000);
    arr.sort((a, b) => a - b);
    var b1, b2;
    for(i = 0; i < arr.length; i ++){
        b1 = random(400000);
        b2 = treeBinarySearch(arr, b1, 0, arr.length - 1);
        if((b2 == arr.length || b1 <= arr[b2]) && (b2 - 1 == -1 || b1 >= arr[b2 - 1])) continue;
        return false;
    }
    return true;
}

function testTreeSplit(){
    var b = new btree(3);
    b.root = b.createNode();
    b.root.keys = [1,16,17,18];
    b.root.n = 4;
    var node = b.createNode();
    b.root.children = [1, node, 3,4,5];
    node.keys = [2, 4, 5, 6, 7];
    node.children = [1, 2, 3, 4, 5, 6];
    node.n = 5;
    b.split(b.root, 1);
    return b;
}

function testTreeInsert(n){
    var b = new btree(n);
    for(let i = 0; i < 15*n; i ++) {
        b.insert(random(150*n));
        b.show();
        console.log("\n")
    }
    return b;
}

function testAll(n){
    var b = new btree(n), num = 10000*n, s = new stack(num), box;
    for(let i = 0; i < num; i ++) {
        box = random(num * 20);
        b.insert(box);
        s.push(box)
    }
    if(!b.check) {
        console.log("insert")
        return false;
    }
    for(let i = 0; i < floor(num / 2); i ++){
        if(!b.delete(s.pop())) {
            console.log("in delete");
            b.check();
            return false;
        }
        if(!b.check) return false;
        //console.log("\n")
    }
    if(!b.check) {
        console.log("delete")
        return false;
    }
    return true;
}

class queue{
    constructor(size){
        this.q = new Array(size);
        this.head = 0;
        this.tail = 0;
        this.n = size;
    }
    enqueue(element){
        if(this.isFull()) null;
        else{
            this.q[this.head] = element;
            this.head = (this.head + 1) % this.n;
        }
    }
    dequeue(){
        if(this.isEmpty()) null;
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
    getNum(){
        return (this.head + this.n - this.tail) % this.n;
    }
    toString(){
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
            }else str += "null";
            if(i + 1 != this.n) str += ", ";
        }
        console.log(str + "]");
    }
}

class stack{
    constructor(size){
        this.s = new Array(size);
        this.n = size;
        this.top = 0;
    }
    pop(){
        if(this.isEmpty()) return;
        else return this.s[-- this.top];
    }
    push(element){
        if(!this.isFull()){
            this.s[this.top] = element;
            this.top ++;
        }else return;
    }
    isEmpty(){
        return this.top == 0;
    }
    isFull(){
        return this.top == this.n;
    }
}



// function testAll(n){
//     var b = new btree(n), num = 100, s = new stack(num), box;
//     for(let i = 0; i < num; i ++) {
//         box = random(num * 20);
//         b.insert(box);
//         s.push(box)
//     }
//     if(!b.check) {
//         console.log("insert")
//         return false;
//     }
//     for(let i = 0; i < floor(num / 2); i ++){
//         if(!b.delete(s.pop())) {
//             console.log("in delete");
//             b.check();
//             return false;
//         };
//         b.show();
//         if(!b.check()) return false;
//         console.log("\n");
//     }
//     if(!b.check) {
//         console.log("delete")
//         return false;
//     }
//     return true;
// }