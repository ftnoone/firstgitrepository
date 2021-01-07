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