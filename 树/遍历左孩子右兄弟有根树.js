function showTreeRecursion(tree, node){
    if(tree.isNullNode(node)) return;
    console.log(tree.getVal(node));
    if(tree.hasLeftChild(node)) showTreeRecursion(tree, tree.getLeftChild(node));
    if(tree.hasRightSibling(node)) showTreeRecursion(tree, tree.getRightSibling(node));
}
showTreeRecursion(tree, tree.getRoot());

function showTree(tree){//需要有父节点的地址
    var node = tree.getRoot(), n = tree.getSize(), i = 0, root = node;
    while(!tree.isNullNode(node)){
        console.log(tree.getVal(node));
        i ++;
        if(i == n) break;
        if(tree.hasLeftChild(node)){
            node = tree.getLeftChild(node);
        }else if(tree.hasRightSibling(node)){
            node = tree.getRightSibling(node);
        }else{
            while(tree.hasParent(node)){
                node = tree.getParent(node);
                if(tree.hasRightSibling(node)){
                    node = tree.getRightSibling(node);
                }else continue;
            }
            if(node == root) throw new Error("返回到根节点了");
        }
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
    getLeftChild(node){

    }
    getRightSibling(node){

    }
    hasLeftChild(node){

    }
    hasRightSibling(node){

    }
    hasParent(){

    }
    getParent(){

    }
}