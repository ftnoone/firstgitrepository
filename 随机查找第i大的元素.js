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
    if(b - a > 5){
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
function randomizedSelect(arr, start, end, i){
    if(start == end) return arr[start];
    var [small, big] = partition(arr, start, end);//因为返回的small和big索引是中间主元分割的左边以为和右边一位，示例，1，2，2，3，选择主元为2时，small索引是元素1的索引0，big是元素3的索引3
    var a = small - start + 2, b = big - start;//所以这里，把索引变成主元的次序，即第一个2是0-0+2，第2大的元素，第二个2是3 - 0等于3，第三大的元素，当找第二大或者第三大的元素，返回arr[small + 1]即可
    if(i >= a && i <= b) return arr[small + 1];
    else if(i < a) return randomizedSelect(arr, start, small, i);
    else return randomizedSelect(arr, big, end, i - b);
}
function testSelect(arr, i){
    if(i <= 0) return false;
    var a = new Array(arr.length);
    for(let i = 0; i < a.length; i ++) a[i] = arr[i];
    a.sort((a, b)=>a - b);
    for(let i = 0; i < a.length; i ++){
        if(a[i] != randomizedSelect(arr, 0, arr.length - 1, i + 1)) return false;
    }
    return true;
}