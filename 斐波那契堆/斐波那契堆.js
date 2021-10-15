class fibHeap{
    constructor(){
        this.min = null;
        this.rootList = new doubleLinkedList();
    }
    creatNode(key, data){
        let temp = new fibHeapNode();
        temp.key = key;
        temp.data = data;
        return temp;
    }
    insert(node){
        if(this.min == null) this.min = node;
        else if(this.min.key > node.key) this.min = node;
        this.rootList.insert(node);
    }
    minimum(){
        return this.min;
    }
    union(h){
        let m1 = this.min || h.min, m2 = h.min || this.min;
        this.min = m1<m2?m1:m2;
        this.rootList.union(h.rootList);
    }
}
class fibHeapNode{
    constructor(){
        this.degree = 0;
        this.mark = false;
        this.p = null;
        this.child = null;
        this.left = null;
        this.key = null;
        this.data = null;
    }
    insert(node){//往left处插入
        node.left = this.left;
        node.right = this;
        this.left.right = node;
        this.left = node;
    }
}
class doubleLinkedList{
    constructor(){
        this.door = null;
    }
    insert(node){//往door的left处插入
        if(this.door == null) {
            this.door = node;
            node.left = node;
            node.right = node;
        }else{
            this.nodeInsert(node, this.door);
        }
    }
    nodeInsert(x, y){//x插入y左边
        x.left = y.left;
        x.right = y;
        y.left.right = x;
        y.left = x;
    }
    union(list){
        if(this.door == null) {
            this.door = list.door;
        }
        else if(list.door == null) return;
        else{
            let rightPoint1 = list.door, rightPoint2 = this.door, leftPoint1 = rightPoint1.left, leftPoint2 = rightPoint2.left;
            rightPoint1.left = leftPoint2;
            leftPoint2.right = rightPoint1;
            rightPoint2.left = leftPoint1;
            leftPoint1.right = rightPoint2;
        }
    }
    [Symbol.iterator]() {
        const door = this.door;
        let node = door, ifEnd = false;
        return {
            next() {
                let obj = {
                    value: ifEnd,
                    done: false
                };
                node = node.right;
                if (node != door) ifEnd = true;
                else return {done: true};
                return obj;
            }
        };
    }
    toString(){
        if(this.door == null) {
            console.log("null");
            return;
        }
        let node = this.door, str = '';
        do{
            str+=node.key + " ⇋ ";
            node = node.right;
        }while(node != this.door);
        console.log(str);
    }
}
var {random, floor} = Math;
function test1(){//完成插入，联合，最小节点，双向循环链表的字符串显示，开始测试
    let h1 = new fibHeap(), h2 = new fibHeap(), num = 10, x1 = floor(random()*num), x2 = floor(random()*num), key;
    for(let i = 0; i < x1; i ++){
        key = floor(random()*num);
        console.log(key);
        h1.insert(h1.creatNode(key, null));
    }
    h1.rootList.toString();
    for(let i = 0; i < x2; i ++){
        key = floor(random()*num);
        console.log(key);
        h2.insert(h2.creatNode(key, null));
    }
    h2.rootList.toString();
    h1.union(h2);
    h1.rootList.toString();
}   