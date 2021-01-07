function showBinaryTree(tree){//普通二叉树，有左右子节点的地址即可
    var node = tree.getRoot(), s = new stack(tree.getSize());
    while(!tree.isNullNode(node)){
        console.log(tree.getVal(node));
        if(tree.hasLeft(node)){
            if(tree.hasRight(node)) s.push(tree.getRight(node));
            node = tree.getLeft(node);
        }else if(tree.hasRight(node)){
            node = tree.getRight(node);
        }else {
            if(s.isEmpty()) break;
            else node = s.pop();
        }
    }
}

class stack{
    constructor(size){
        if(size == undefined || size <= 0) throw new Error("请输入正确的参数");
        this.s = new Array(size);
        this.n = size;
        this.top = 0;
    }
    pop(){
        if(this.isEmpty()) throw new Error("空栈");
        else return this.s[-- this.top];
    }
    push(element){
        if(!this.isFull()){
            this.s[this.top] = element;
            this.top ++;
        }else throw new Error("已满");
    }
    isEmpty(){
        return this.top == 0;
    }
    isFull(){
        return this.top == this.n;
    }
}

class binaryTree{
    constructor(){

    }
    getRoot(){

    }
    isNullNode(node){

    }
    getSize(){

    }
    getVal(node){

    }
    getLeft(node){

    }
    getRight(node){

    }
    hasLeft(node){

    }
    hasRight(node){
        
    }
    hasParent(){

    }
    getParent(){

    }
}