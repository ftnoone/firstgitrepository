class linkedList{
    constructor(){
        this.head = null;
    }
    insert(key){
        var ele = new linkedNode(key, this.head);
        this.head = ele;
    }
    delete(key){
        var node = this.head, prev = null;
        while(node != null && node.key != key){
            prev = node;
            node = node.next;
        }
        if(node != null){
            if(prev != null) prev.next = node.next;
            else this.head = node.next;
            console.log(node);
            node = null;
        }
    }
    isEmpty(){
        return this.head == null;
    }
    reverse(){
        var a, b, c;
        a = null;
        b = this.head;
        while(b != null){
            c = b.next;
            b.next = a;
            a = b;
            b = c;
        }
        this.head = a;
    }
    toString(){
        var node = this.head, str = "";
        while(node != null){
            str += node.key;
            if(node.next != null){
                str += " -> "
            }
            node = node.next;
        }
        console.log(str);
    }
}
class linkedNode{
    constructor(key, next){
        this.next = next;
        this.key = key;
    }
}