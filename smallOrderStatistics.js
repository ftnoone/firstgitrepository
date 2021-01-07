var random = Math.random, floor = Math.floor;
function partition(arr, p, r){
    var num = getMid(arr, p, r); //选择一个值作为比较的关键值
    var smallPart = p - 1, bigPart = r + 1;
    for(let i = p, a; i < bigPart; i ++){
        a = arr[i] - num;
        if(a < 0){
            smallPart ++;
            swap(arr, i, smallPart);
        }else if(a > 0){
            bigPart --;
            while((a = arr[bigPart] - num) > 0) bigPart --;
            swap(arr, i, bigPart);
            if(a < 0) {
                smallPart ++;
                swap(arr, i, smallPart);
            }
        }
    }
    return [smallPart, bigPart];
}
function getMid(arr, a, b){//获得尽量位于中间区间的关键值, 以5个元素为一组
    if(a == b) return arr[a];
    var num = 5, temp = new Array(num), span = Math.ceil((b - a + 1) / num), nextArr = new Array(span);
    for(let i = 0, j, k = a, h, z = 0; i < span; i ++){
        j = 0;
        while(j < num && k <= b){
            box = arr[k ++];
            for(h = j - 1; h >= 0; h --){
                if(box < temp[h]) temp[h + 1] = temp[h];
                else break;
            }
            temp[h + 1] = box;
            j ++;
        }
        j --;
        nextArr[z ++] = temp[floor(j / 2)];
    }
    return getMid(nextArr, 0, span - 1);
}
function swap(arr, a, b){//交换元素
    if(a != b){
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
}
function select(arr, start, end, i){
    if(start == end) return arr[start];
    var [small, big] = partition(arr, start, end);//因为返回的small和big索引是中间主元分割的左边以为和右边一位，示例，1，2，2，3，选择主元为2时，small索引是元素1的索引0，big是元素3的索引3
    var a = small - start + 2, b = big - start;//所以这里，把索引变成主元的次序，即第一个2是0-0+2，第2大的元素，第二个2是3 - 0等于3，第三大的元素，当找第二大或者第三大的元素，返回arr[small + 1]即可
    if(i >= a && i <= b) return arr[small + 1];
    else if(i < a) return select(arr, start, small, i);
    else return select(arr, big, end, i - b);
}
function testSelect(arr){
    var a = new Array(arr.length);
    for(let i = 0; i < a.length; i ++) a[i] = arr[i];
    a.sort((a, b)=>a - b);
    for(let i = 0; i < a.length; i ++){
        if(a[i] != smallOrderStatistics(arr, 0, arr.length - 1, i + 1)) return false;
    }
    return true;
}

function smallOrderStatistics(arr, start, end, i){
    var len = end - start + 1;
    if(i < (len / 2)){
        var temp = new Array(len), k = 0;
        for(let j = start; j + 2 <= end; j += 2){
            if(arr[j] > arr[j + 1]) temp[k ++] = arr[j + 1];
            else temp[k ++] = arr[j];
        }
        if(len % 2) temp[k ++] = arr[end];
        var num = smallOrderStatistics(temp, 0, k - 1, i);
        k = 0;
        for(let j = start; j <= end; j += 2){
            if(arr[j] <= num || arr[j + 1] <= num){
                temp[k ++] = arr[j];
                temp[k ++] = arr[j + 1];
            }
        }
        if(len % 2 && arr[end] <= num) temp[k ++] = arr[end];
        return select(temp, 0, k - 1, i);
    }else return select(arr, start, end, i);
}