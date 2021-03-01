class btree{
    constructor(degree){
        this.degree = degree || 2;//b树的度degree >= 2;
        if(this.degree < 2) return null;
        this.root = null;
    }
    insert(key){

    }
    search(key){

    }
}
class btreeNode{
    constructor(size){
        this.keys = new Array(size);
        this.leaves = new Array(size);
        this.ifLeaf = true;
    }
}
function binarySearch(arr, key, start, end){
    var middle;
    while(start < end){
        middle = Math.floor((end + start) / 2);
        if(key == arr[middle]) return middle;
        else if(key > arr[middle]) start = middle + 1;
        else end = middle - 1;
    }
    if(arr[start] == key) return start;
    else return -1;
}
var floor = Math.floor;
function random(n){
    return floor(Math.random() * n);
}
function testBinarySearch(){
    var arr = new Array(2000), i;
    for(i = 0; i < arr.length; i ++) arr[i] = random(400000);
    arr.sort((a, b) => a - b);
    var bin;
    for(i = 0; i < arr.length; i ++){
        if((bin = binarySearch(arr, arr[i], 0, arr.length - 1)) != i) {
            if(arr[bin] == arr[i]) continue;
            return false;
        }
    }
    return true;
}