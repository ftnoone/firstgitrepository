var random = Math.random, floor = Math.floor;
function partition(arr, p, r){
    var num = getRandom(arr, p, r); //随机一个值作为比较的关键值
    swap(arr, p, num);//交换到第一个
    var key = arr[p], smallPart = p - 1, bigPart = r + 1;
    for(let j = p + 1, box; j < bigPart; j ++){//遍历除关键值的其它元素
        box = arr[j] - key;//储存比较的结果
        if(box < 0){//比关键值小，则和smallpart交换，使数组在结束时 smallpart和bigpart之间的元素等于关键值，小于等于smallpart索引的数组元素小于关键值， 大于等于bigpart索引的数组元素大于关键值
            smallPart ++;//smallpart右移
            swap(arr, j, smallPart);//将smallpart索引下等于关键值的元素和小于关键值的j索引的元素交换
        }else if(box > 0){//比关键值大则移到数组最后面
            bigPart --;//bigpart左移
            while((box = arr[bigPart] - key) > 0) bigPart --;//从bigpart开始往左遍历直到找到小于等于关键值的元素，并用box存下比较结果，后面用
            swap(arr, j, bigPart);//将bigpart索引的小于关键值的元素和j索引下的大于关键值的元素交换
            if(box < 0) {//如果这个元素还小于关键值，则右移smallpart，交换到smallpart的左边
                smallPart ++;
                swap(arr, j, smallPart);
            }
        }
    }
    return [smallPart, bigPart];//返回samllpart和bigpart索引
}
function getRandom(arr, a, b){//获得尽量位于中间区间的关键值
    if(b - a > 3){
        var x, y, z, f1, f2;
        x = floor(random() * (b - a + 1)) + a;
        y = floor(random() * (b - a + 1)) + a;
        z = floor(random() * (b - a + 1)) + a;
        f1 = arr[x] - arr[y]; //储存比较的结果
        f2 = arr[x] - arr[z];
        if(f1 > 0 && f2 > 0) { //如果x索引的值都大于其它索引的值再次比较，找到中间值
            if(arr[y] > arr[z]) return y;
            else return z;v
        }else if(f1 < 0 && f2 < 0){ //如果x索引的值都小于其它索引的值再次比较，找到中间值
            if(arr[y] < arr[z]) return y; 
            else return z;
        }else return x;//否则要么x索引的值大于一个，小于另一个，要么x索引的值与其它的一个值相等，两种情况，都返回x索引
    }else return floor(random() * (b - a + 1)) + a;
}
function swap(arr, a, b){//交换元素
    if(a != b){
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
}
function quickSort(arr, a, b, k){//这是快排
    while(b - a > k){//用while减少递归的栈深度
        var [small, big] = partition(arr, a, b);//进行元素分割，使之小的在左边，大的在右边，不进行具体的排序
        if(small - a > b - big){//找到含有较少元素的一部分去递归，剩下较多元素的数组部分进入循环
            quickSort(arr, big, b, k);
            b = small;
        }else{
            quickSort(arr, a, small, k);
            a = big;
        }
    }
}
function test2(a, n){//测试快排
    var arr = [];
    for(let i = 0; i < n; i++) arr.push(floor(random() * a));
    console.time("sort");
    quickSort(arr, 0,arr.length-1, 0);
    console.timeEnd("sort");
    console.log(arr);
}
function test1(a, n, b){//测试快排和插入排序的组合
    var arr = [];
    for(let i = 0; i < n; i++) arr.push(floor(random() * a));
    console.time("sort");
    sort(arr, b);
    console.timeEnd("sort");
    console.log(arr);
}
function sort(arr, k){//快排组合插入排序
    quickSort(arr, 0, arr.length - 1, k);
    insertSort(arr, 0, arr.length - 1);
}
function insertSort(arr, a, b){//插入排序
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
function test3(a, n){//系统排序
    var arr = [];
    for(let i = 0; i < n; i++) arr.push(floor(random() * a));
    console.time("sort");
    arr.sort();
    console.timeEnd("sort");
    console.log(arr);
}