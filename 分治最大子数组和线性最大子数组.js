var arr = [2,-5,69,95,-69,85, -96,42,-88,15,8,4,-80,5,68,6,-9,8,-8,9,5,8,8,9,98,8,8];
function maxSubArrary(arr){
    var len = arr.length, left, max = 0, i = 0;
    while(arr[i] <= 0) i ++; //如果是负数则不管，全部略过
    if(i == len) { //如果 i 等于数组的长度 len 说明全是负数，则找出其中最大值即可
    i = 1;
    max = arr[0];
    left = 0;
    while(i < len) {
        if(max < arr[i]){
        max = arr[i];
        left = i;
        }
        i ++;
    }
    return {
        left: left,
        right: left,
        max: max
    };
    }
    var sum = 0;
    left = i;
    var maxleft = 0, maxright = 0; //初始化变量
    while(i < len){
    do{
        sum += arr[i]; //前面略过负数，则从此处开始为正数，直接开始求和
    }while(++ i < len && arr[i] > 0)//从循环出来说明有负数或者已经求出最大子数组和
    if(sum > max){//比较求和值与前一次的求和值并替换
        maxleft = left;
        maxright =  i - 1;
        max = sum;
    }
    do{
        sum += arr[i];
    }while(++ i < len && arr[i] <= 0)//求负数和
    if(sum > 0) {//如果负数和与前一次求和值的和大于零，说明仍然可以作为求最大子数组和的一部分，则变换
        if(sum > max){
        maxleft = left;
        maxright =  i - 1;
        max = sum;
        }
    }else{
        left = i;
        sum = 0;
    }
    }
    return {
    left: maxleft,
    right: maxright,
    max: max
    };
}


function maxSubArraryRenew(arr){
    var len = arr.length, left, max = 0, i = 0;
    while(arr[i] <= 0) i ++; //如果是负数则不管，全部略过
    if(i == len) { //如果 i 等于数组的长度 len 说明全是负数，则找出其中最大值即可
    i = 1;
    max = arr[0];
    left = 0;
    while(i < len) {
        if(max < arr[i]){
        max = arr[i];
        left = i;
        }
        i ++;
    }
    return {
        left: left,
        right: left,
        max: max
    };
    }
    var sum = 0;
    left = i;
    var maxleft = 0, maxright = 0;
    while(i < len){
    sum += arr[i ++];
    if(sum <= 0){
        left = i;
        sum = 0;
    }else if(sum > max){
        maxleft = left;
        maxright =  i - 1;
        max = sum;
    }
    }
    return {
    left: maxleft,
    right: maxright,
    max: max
    };
}


var floor = Math.floor;
function findMaxSubArraryByDivide(arr, start, end){
    if(start == end){
    return {
        left: start,
        right: end,
        max: arr[start]
    }
    }else{
    var middle = floor((start + end) / 2);
    var leftmax, rightmax, middlemax;
    leftmax = findMaxSubArraryByDivide(arr, start, middle);
    rightmax = findMaxSubArraryByDivide(arr, middle + 1, end);
    middlemax = findMiddleMaxSubArrary(arr, start, middle, end);
    var a = leftmax.max, b = rightmax.max, c = middlemax.max;
    if(a > b && a > c) return leftmax;
    else if(b > c && b > a) return rightmax;
    else return middlemax;
    }
}
function findMiddleMaxSubArrary(arr, start, middle, end){
    var i = middle, leftmax = arr[middle], sum = leftmax, left, right = middle, left = middle;
    for(-- i; i >= start; i --){
    sum += arr[i];
    if(sum > leftmax){
        leftmax = sum;
        left = i;
    }
    }
    var rightmax;
    i = middle + 1;
    if(i <= end) {
    rightmax = arr[i ++];
    sum = rightmax;
    }
    while(i <= end){
    sum += arr[i];
    if(sum > rightmax){
        rightmax = sum;
        right = i;
    }
    i ++;
    }
    if(rightmax < 0){
    rightmax = 0;
    right = middle;
    }
    return {
    left: left,
    right: right,
    max: leftmax + rightmax
    }
}