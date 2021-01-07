function radixSort(arr, start, end, range){
    var len = end - start + 1;
    if(range > len){
        let r = floorLg(len), n = 0, temp = arr;//r是lg(n)，在二进制下分成lg(n)个位数的段
        for(let i = 1; (i << (n*r)) < range; n ++) ;//找到range要分成几节去排序，如n = 4，lg(n) = 2，range = 17在二进制中为10001，则分成01，00，01，每个部分去单独做稳定的排序
        console.log(len, r, n);
        for(let i = 0; i < n; i ++) temp = forRadixCountSort(temp, start, end, r, i);
        return temp;
    }else{
        return countSort(arr, start, end, 0, range - 1);
    }
}
function forRadixCountSort(arr, start, end, r, n){
    var range = 1 << r, b = new Array(range).fill(0), val = range - 1, move = r*n;
    val <<= move;
    console.log(`第${n}次输出开始：` + val.toString(2));
    for(let i = start; i <= end; i ++){
        b[(arr[i] & val) >> move] ++;
    }
    for(let i = 1; i < range; i ++){
        b[i] += b[i - 1];
    }
    var temp = new Array(end - start + 1);
    for(let i = end, bin; i >= start; i --){
        bin = arr[i];
        temp[-- b[(bin & val) >> move]] = bin;
    }
    console.log(`第${n}次输出结束：` + temp);
    return temp;
}
function floorLg(n){
    var lg2 = 0;
    while((1 << lg2) <= n)  lg2 ++;
    return lg2 - 1;
}
function countSort(arr, start, end, rangeStart, rangeEnd){
    var range = rangeEnd - rangeStart + 1, b = new Array(range).fill(0);
    for(let i = start; i <= end; i ++){
        b[arr[i] - rangeStart] ++;
    }
    for(let i = 1; i < range; i ++){
        b[i] += b[i - 1];
    }
    var temp = new Array(end - start + 1);
    for(let i = end, bin; i >= start; i --){
        bin = arr[i] - rangeStart;
        temp[b[bin] - 1] = bin + rangeStart;
        b[bin] --;
    }
    return temp;
}
function testRadixSort(arr){
    var max = arr[0], len = arr.length;
    for(let i = 0; i < len; i ++) {
        if(arr[i] < 0) return;
        if(arr[i] > max) max = arr[i];
    }
    console.log(len, max)
    return radixSort(arr, 0, len - 1, max + 1);
}