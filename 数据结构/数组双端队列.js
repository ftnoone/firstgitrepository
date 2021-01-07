class twoHeadQueue{
    constructor(size){
        if(size == undefined || size <= 1) throw new Error("参数不正确");
        this.q = new Array(size);
        this.head = 0;
        this.tail = 0;
        this.n = size;
    }
    headEnQueue(ele){
        if(this.isFull()) throw new Error("队列已满");
        else{
            this.q[this.head] = ele;
            this.head = (this.head + 1) % this.n;
        }
    }
    tailEnQueue(ele){
        if(this.isFull()) throw new Error("队列已满");
        else{
            this.tail = (this.tail + this.n - 1) % this.n;
            this.q[this.tail] = ele;
        }
    }
    headDeQueue(){
        if(this.isEmpty()) throw new Error("空队列");
        else{
            this.head = (this.head - 1 + this.n) % this.n;
            return this.q[this.head];
        }
    }
    tailDeQueue(){
        if(this.isEmpty()) throw new Error("空队列");
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
            }else str += "空";
            if(i + 1 != this.n) str += ", ";
        }
        console.log(str + "]");
    }
}