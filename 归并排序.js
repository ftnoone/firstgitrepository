function merge(arr, start, middle, end){
    var n1 = middle - start + 1, n2 = end - middle;
    var arr1 = new Array(n1), arr2 = new Array(n2);
    for(let i = 0; i < n1; i ++) arr1[i] = arr[start + i];
    for(let i = 0; i < n2; i ++) arr2[i] = arr[middle + i + 1];
    let j1 = 0, j2 = 0, arrindex = start;
    for(; j1 < n1 && j2 < n2; arrindex ++){
        if(arr1[j1] < arr2[j2]) arr[arrindex] = arr1[j1 ++];
        else arr[arrindex] = arr2[j2 ++];
    }
    for(let i = j1; i < n1; i++){
        arr[arrindex ++] = arr1[i];
    }
    for(let i = j2; i < n2; i++){
        arr[arrindex ++] = arr2[i];
    }
    var str = "[";
    for(let i = 0; i < n1 + n2; i ++){
        str += arr[start + i] + " ";
    }
    console.log(arr1, arr2);
    console.log(str += "]")
}
function mergesort(arr, start, end){
    if(start < end){
        var middle = Math.floor((start + end) / 2);
        mergesort(arr, start, middle);
        mergesort(arr, middle + 1, end);
        console.log(start, end);
        merge(arr, start, middle, end);
    }
}
var arr = [7,5,6,45,49,26,1,5,7,8,9,26,4,9,2,616,12];
mergesort(arr, 0, arr.length - 1);

function searchbydivide(arr, num, start = 0, end = arr.length - 1){
    while(start <= end){
        let middle = Math.floor((start + end) / 2);
        let temp = arr[middle];
        if(temp == num) return middle;
        else if(temp < num) start = middle + 1;
        else end = middle - 1;
    }
    return -1;
}