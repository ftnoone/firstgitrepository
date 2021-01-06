function showBinaryTree(tree){
    var node = tree.getRoot(), n = tree.getSize(), i = 0, prev, root = node;
    while(!tree.isNullNode(node)){
        console.log(tree.getVal(node));
        i ++;
        if(i == n) break;
        if(tree.hasLeft(node)){
            node = tree.getLeft(node);
        }else if(tree.hasRight(node)){
            node = tree.getRight(node);
        }else{
            while(tree.hasParent(node)){
                prev = node;
                node = tree.getParent(node);
                if(prev == tree.getLeft(node)){
                    if(tree.hasRight(node)){
                        node = tree.getRight(node);
                        break;
                    }else continue;
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
    getLeft(node){

    }
    getRight(node){

    }
    hasParent(){

    }
    getParent(){

    }
}