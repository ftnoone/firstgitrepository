class stack{
    constructor(size){
        if(size == undefined || size <= 0) throw new Error("请输入正确的参数");
        this.s = new Array(size);
        this.n = size;
        this.top = 0;
    }
    pop(){
        if(this.isEmpty()) return null;
        else return this.s[-- this.top];
    }
    push(element){
        if(!this.isFull()){
            this.s[this.top ++] = element;
            return true;
        }else return false;
    }
    isEmpty(){
        return this.top == 0;
    }
    isFull(){
        return this.top == this.n;
    }
}