var random = Math.random, floor = Math.floor;
function partition(arr, p, r){
    var num = floor(random() * (r - p + 1)) + p;
    swap(arr, r, num);
    var key = arr[r], i = p - 1;
    for(let j = p; j < r; j ++){
        if(arr[j] <= key){
            i ++;
            swap(arr, i, j);
        }
    }
    i ++;
    swap(arr, i, r);
    return i;
}
function swap(arr, a, b){
    if(a != b){
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
}
function quickSort(arr, a, b, k){
    if(b - a > k){
        var middle = partition(arr, a, b);
        quickSort(arr, a, middle - 1, k);
        quickSort(arr, middle + 1, b, k);
    }
}
function tostring(arr, a, b){
    var str = "[";
    for(let i = a; i <= b; i ++) str += arr[i] + ", ";
    str += a + " ~ " + b + "]";
    console.log(str);
}
function sort(arr, k){
    quickSort(arr, 0, arr.length - 1, k);
    insertSort(arr, 0, arr.length - 1);
}
function insertSort(arr, a, b){
    for(let i = a + 1, j; i <= b; i ++){
        key = arr[i];
        for(j = i - 1; j >= a; j --) {
            if(key < arr[j]){
                arr[j + 1] = arr[j];
            }else break;
        }
        arr[j + 1] = key;
    }
}
function test1(a, b){
    var arr = [];
    for(let i = 0; i < 400000; i++) arr.push(floor(random() * a));
    console.time("sort");
    sort(arr, b);
    console.timeEnd("sort");
    console.log(arr);
}
function test2(a){
    var arr = [];
    for(let i = 0; i < 400000; i++) arr.push(floor(random() * a));
    console.time("sort");
    quickSort(arr, 0,arr.length-1, 0);
    console.timeEnd("sort");
    console.log(arr);
}
function test3(a){
    var arr = [];
    for(let i = 0; i < 400000; i++) arr.push(floor(random() * a));
    console.time("sort");
    arr.sort();
    console.timeEnd("sort");
    console.log(arr);
}

function quickSort2(arr,low,high){
    var i = low;
    var j = high;
    var temp = arr[low];
    if(low < high){
        //下面这个循环完成了一趟排序,将数组中比temp小的关键字都放在temp的左边;将数组中比temp大的关键字都放在temp的右边
        while(i != j){
            //从右往左扫描,找到一个比temp小的关键字
            while(i < j && arr[j] >= temp){
                j--;
            }
            if(i < j){
                arr[i] = arr[j];
                i++;//i向右移一位
            }
            //从左往右扫描,找到一个比temp大的关键字
            while(i < j && arr[i] <= temp){
                i++;
            }
            if(i < j){
                arr[j] = arr[i];
                j--;//j向左移一位
            }
        }
        //第一趟排序结束,将temp放在最终的位置上
        arr[i] = temp;
        //递归地对temp左边的关键字进行排序
        quickSort2(arr,low,i-1);
        //递归地对temp右边的关键字进行排序
        quickSort2(arr,i+1,high);
    }
}
function test4(a){
    var arr = [];
    for(let i = 0; i < 400000; i++) arr.push(floor(random() * a));
    console.time("sort");
    quickSort2(arr, 0,arr.length-1);
    console.timeEnd("sort");
    console.log(arr);
}