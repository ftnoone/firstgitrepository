class bst{//二叉搜索树，左小右大
    tree = this;
    root = null;
    eleNum = 0;
    constructor(tree){
        if(tree instanceof bst) {
            this.tree = tree;
            this.root = tree.root;
            this.eleNum = tree.eleNum;
        }
    }
    getRoot(){
        return this.root;
    }
    insert(key, ele, node){
        if(!(node instanceof bstnode)) node = this.root;
        var temp = new bstnode(key, ele);
        if(node == null) this.root = temp;
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
        }
        this.eleNum ++;
    }
    delete(node){
        if(!(node instanceof bstnode)) return;
        if(node.left == null) this.transplant(node, node.right);
        else if(node.right == null) this.transplant(node, node.left);
        else {
            var leftMax = this.maximum(node.left);
            this.transplant(leftMax, leftMax.left);
            node.key = leftMax.key;
            node.ele = leftMax.ele;
            if(leftMax == node.left) node.left = null;
            // if(leftMax.p != node) {
            //     this.transplant(leftMax, leftMax.left);
            // }
        }
        this.eleNum --;
    }
    transplant(a, b){
        var p = a.p;
        if(p == null) this.root = b;
        else if(a == p.left) p.left = b;
        else p.right = b;
        if(b != null) b.p = p;
    }
    successor(node){
        if(!(node instanceof bstnode)) return;
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
        if(!(node instanceof bstnode)) return;
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
        if(!(node instanceof bstnode)) node = this.root;
        if(node == null) return null;
        while(node.right != null){
            node = node.right;
        }
        return node;
    }
    minimum(node){
        if(!(node instanceof bstnode)) node = this.root;
        if(node == null) return null;
        while(node.left != null) node = node.left;
        return node;
    }
    show(){
        var pre = null, node = this.minimum(this.root), str = "";
        while(node != null){
            str += node.key + ", ";
            node = this.successor(node);
        }
        console.log(str + "size: " + this.eleNum);
    }
}
class bstnode{
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
    var node = bba.minimum();
    for(let i = 0; i < arr.length; i ++){
        if(node.key != arr[i]){
            console.log("false",node.key, arr[i], i);
            for(let i = 0; i < 30; i ++) if(arr2[i] == node.key) consolr.log("had deleted", arr2[i])
            return false;
        }
        node = bba.successor(node);
    }
    return true;
}