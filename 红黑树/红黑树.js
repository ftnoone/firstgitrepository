var color = {red: 1, black: 0};//1: red, 0: black;
//红黑树性质：
// 1.每个结点或是红色的，或是黑色的
// 2.根结点是黑色的
// 3.每个叶结点是黑色的：指所有的null指向一个黑色的节点（哨兵）
// 4.如果一个结点是红色的，则它的两个子结点都是黑色的
// 5.对每个结点，从该结点到其所有后代叶结点的简单路径上，均包含相同数目的黑色结点

class redBlackT{
    eleNum = 0;
    blackHeight = 0;
    constructor(){
        this.nullNode = new treenode();
        this.nullNode.color = color.black;
        this.root = null;
    }
    getRoot(){
        return this.root;
    }
    insert(key, ele, node){
        if(!(node instanceof treenode)) node = this.root;//如果是null或者其它，则置node为根节点
        var temp = new treenode(key, ele);
        if(node == null) {//只有赋值为根节点时才有可能为null，红黑树性质，根节点必须为黑色
            temp.color = color.black;
            this.root = temp;
            this.blackHeight ++;
        }
        else{
            var pre;
            while(node != null){
                pre = node;
                if(key > node.key) node = node.right;
                else node = node.left;
            }
            if(key > pre.key) pre.right = temp;
            else pre.left = temp;
            temp.p = pre;
            this.fixup(temp);
        }
        this.eleNum ++;
        return true;
    }
    fixup(node){
        if(node.color != color.red) {
            console.log("the node fixed must be red");
            return ;
        }
        var temp;
        while(node.p.color == color.red){
            temp = node.p.p;//因为进入循环时满足，node父节点为红，因为红黑树性质2，所以必然表示根节点，不是根节点则存在父节点，即node.p.p存在
            if(node.p == temp.left){//node.p是node.p.p的left/right时的情况对称，交换left和right即可
                if(temp.right != null && temp.right.color == color.red){//node.p.p等于null时表示为黑色，情况1
                    temp.color = color.red;//这种情况改变node.p.p颜色为红时，仍然保持红黑树性质5，因为左右子节点原本是红色，都变成黑色，则路径上的黑色节点数不变
                    temp.right.color = color.black;
                    node.p.color = color.black;
                    node = temp;
                    if(node.p == null) {//处理根节点的情况
                        node.color = color.black;
                        this.blackHeight ++;
                        break;
                    }
                    continue;
                }else if(node == node.p.right){//把情况2转换为情况3
                    node = node.p;
                    this.leftRotate(node);
                }
                node.p.color = color.black;//处理情况3
                temp.color = color.red;
                this.rightRotate(temp);
                break;
            }else{
                if(temp.left != null && temp.left.color == color.red){
                    temp.color = color.red;
                    temp.left.color = color.black;
                    node.p.color = color.black;
                    node = temp;
                    if(node.p == null) {
                        node.color = color.black;
                        this.blackHeight ++;
                        break;
                    }
                    continue;
                }else if(node == node.p.left){
                    node = node.p;
                    this.rightRotate(node);
                }
                node.p.color = color.black;
                temp.color = color.red;
                this.leftRotate(temp);
                break;
            }
        }
    }
    leftRotate(node){
        if(node.right == null){
            console.log("the node must have a right child");
            return ;
        }
        var y = node.right;
        node.right = y.left;
        if(y.left != null) y.left.p = node;
        y.left = node;
        if(node.p == null) this.root = y;
        else if(node.p.left == node) node.p.left = y;
        else node.p.right = y;
        y.p = node.p;
        node.p = y;
    }
    rightRotate(node){
        if(node.left == null){
            console.log("the node must have a left child");
            return ;
        }
        var y = node.left;
        node.left = y.right;
        if(y.right != null) y.right.p = node;
        y.right = node;
        if(node.p == null) this.root = y;
        else if(node.p.left == node) node.p.left = y;
        else node.p.right = y;
        y.p = node.p;
        node.p = y;
    }
    delete(node){//删除一个元素节点，便从左子树取得最大的元素，放在节点处，并删除左子树的最大元素
        if(!(node instanceof treenode)) return;
        if(node.left == null) this.transplant(node, node.right);
        else if(node.right == null) this.transplant(node, node.left);
        else {
            var leftMax = this.maximum(node.left);
            this.transplant(leftMax, leftMax.left);//二叉树性质，因为最大，所以这个元素必然没有右子树，把它的左子树移到本身即可
            node.key = leftMax.key;
            node.ele = leftMax.ele;
            //if(leftMax == node.left) node.left = null;
            // if(leftMax.p != node) {
            //     this.transplant(leftMax, leftMax.left);
            // }
        }
        this.eleNum --;
    }
    transplant(a, b){//把b移到a处，移植二叉树
        var p = a.p;
        if(p == null) this.root = b;
        else if(a == p.left) p.left = b;
        else p.right = b;
        if(b != null) b.p = p;
    }
    successor(node){
        if(!(node instanceof treenode)) return;
        var pre;
        if(node.right != null) return this.minimum(node.right);
        else{
            do{
                pre = node;
                node = node.p;
                if(node == null) return null;
            }while(pre != node.left)
            return node;
        }
    }
    predecessor(node){
        if(!(node instanceof treenode)) return;
        var pre;
        if(node.left != null) return this.maximum(node.left);
        else{
            do{
                pre = node;
                node = node.p;
                if(node == null) return null;
            }while(pre != node.right)
            return node;
        }
    }
    search(key){
        var node = this.root;
        while(node != null && node.key != key){
            if(key > node.key) node = node.right;
            else node = node.left;
        }
        return node;
    }
    maximum(node){
        if(!(node instanceof treenode)) node = this.root;
        if(node == null) return null;
        while(node.right != null){
            node = node.right;
        }
        return node;
    }
    minimum(node){
        if(!(node instanceof treenode)) node = this.root;
        if(node == null) return null;
        while(node.left != null) node = node.left;
        return node;
    }
    showSort(){
        var node = this.minimum(this.root), str = "";
        while(node != null){
            str += node.key + ", ";
            node = this.successor(node);
        }
        console.log(str + "size: " + this.eleNum);
    }
    check(){
        var node = this.root, prev = null, i = 0, blackcount = 0;
        if(node != null && node.color != color.black) {
            console.log("root node must be black");
            return false;
        }
        while(node != null){
            if(node.p != prev) {
                console.log("parent of node is worry, parent: ", prev, "child: ", node);
                return false;
            }
            if(prev != null && prev.color == color.red){
                if(node.color != color.black) {
                    console.log("parent is red, child is red, parent: ", prev, "child: ", node);
                    return false;
                }
            }
            if(node.color == color.black) blackcount++;
            i ++;
            prev = node;
            if(node.left != null){
                node = node.left;
            }else if(node.right != null){
                node = node.right;
            }else{
                if(blackcount != this.blackHeight) {
                    console.log("black height is worry: ", blackcount, "fact: ", this.blackHeight);
                    return false;
                }
                let j = 0;
                while(node.p != null){
                    prev = node;
                    node = node.p;
                    if(prev.color == color.black) blackcount --;
                    j ++;
                    if(j > this.eleNum) {
                        console.log("in up recursion: ", j, "all node num: ", this.eleNum);
                        return false;
                    }
                    if(node.left != null && prev == node.left && node.right != null){
                        prev = node;
                        node = node.right;
                        break;
                    }
                }
                if(node.p == null) break;
            }
            if(i > this.eleNum) {
                console.log("in down recursion: ", i, "all node num: ", this.eleNum);
                return false;
            }
        }
        if(i < this.eleNum) {
            console.log("check node num: ", i, "all node num: ", this.eleNum);
            return false;
        }
        return true;
    }
}

class treenode{
    color = color.red;//1: red, 0: black;
    p = null;
    left = null;
    right = null;
    constructor(key, ele){
        this.key = key;
        this.ele = ele;
    }
    getKey(){
        return this.key;
    }
    getEle(){
        return this.ele;
    }
}

var random = Math.random, floor = Math.floor, bba, arr2, arr3;
function test(){
    var arr = new Array(300);
    arr2 = new Array(30);
    bba = new bst();
    for(let i = 0; i < 300; i ++){
        arr[i] = floor(random() * 10000);
        bba.insert(arr[i]);
    }
    arr.sort((a, b)=>a - b);
    arr3 = new Array(300);
    for(let i = 0; i < 300; i ++){
        arr3[i] = arr[i];
    }
    var node = bba.minimum();
    for(let i = 0; i < 300; i ++){
        if(node.key != arr[i]) return false;
        node = bba.successor(node);
    }
    node = bba.maximum();
    for(let i = 299; i >= 0; i --){
        if(node.key != arr[i]) return false;
        node = bba.predecessor(node);
    }
    console.log("insert yes");
    for(let i = 0, num, limit = 300, box, temp; i < 30; i ++){
        num = floor(random() * limit);
        node = bba.search(arr[num]);
        arr2[i] = arr[num];
        if(node == null) console.log("delete",arr[num], num);
        if(node.key!=arr[num]){
            console.log("delete",arr[num],node.key==arr[num], i, node.key, num);
            return false;
        }
        temp = node.key;
        bba.delete(node);
        box = arr.splice(num, 1);
        if(box[0] != temp || box.length != 1){
            console.log("delete arr", box[0] == temp && box.length == 1)
            return false;
        }
        limit --;
    }
    arr.sort((a, b)=>a - b);
    node = bba.minimum();
    for(let i = 0; i < arr.length; i ++){
        if(node.key != arr[i]){
            console.log("false",node.key, arr[i], i);
            for(let i = 0; i < 30; i ++) if(arr2[i] == node.key) consolr.log("had deleted", arr2[i])
            return false;
        }
        node = bba.successor(node);
    }
    node = bba.maximum();
    for(let i = arr.length - 1; i >= 0; i --){
        if(node.key != arr[i]){
            console.log("false",node.key, arr[i], i);
            for(let i = 0; i < 30; i ++) if(arr2[i] == node.key) consolr.log("had deleted", arr2[i])
            return false;
        }
        node = bba.predecessor(node);
    }
    return true;
}