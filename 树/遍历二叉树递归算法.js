function showBinaryTree(tree, node){//普通二叉树即可，需要左右节点地址
    if(tree.isNullNode(node)) return;
    console.log(tree.getVal(node));
    showBinaryTree(tree, tree.getLeft(node));
    showBinaryTree(tree, tree.getRight(node));
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