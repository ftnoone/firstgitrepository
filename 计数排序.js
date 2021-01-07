function countSort(arr, start, end, rangeStart, rangeEnd){
    var range = rangeEnd - rangeStart + 1, b = new Array(range).fill(0);//保证范围精确的包围数值
    for(let i = start; i <= end; i ++){
        b[arr[i] - rangeStart] ++;
    }
    for(let i = 1; i < range; i ++){
        b[i] += b[i - 1];
    }
    var temp = new Array(end - start + 1);
    for(let i = end, bin; i >= start; i --){
        bin = arr[i] - rangeStart;
        temp[-- b[bin]] = bin + rangeStart;
    }
    return temp;
}
function scountsort(arr){
    var len = arr.length, max = arr[0], min = arr[0];
    for(let i = 1; i < len; i ++) {
        if(max < arr[i]) max = arr[i];
        if(min > arr[i]) min = arr[i];
    }
    return countSort(arr, 0, len - 1, min, max);
}
function compare(a, b){
    var arr = new Array(a.length);
    for(let i = 0; i < a.length; i ++) arr[i] = a[i];
    arr.sort((a, b)=>a - b);
    for(let i = 0; i < arr.length; i ++){
        if(arr[i] != b[i]) return false;
    }
    return true;
}