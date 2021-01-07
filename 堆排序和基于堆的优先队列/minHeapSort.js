var floor = Math.floor;
function minHeapify(heap, i, size){
    var left, right, minimum, temp;
    i ++;
    do{
        left = 2*i;
        right = left + 1;
        if(right <= size && heap[right - 1] < heap[i - 1]) minimum = right;
        else minimum = i;
        if(left <= size && heap[left - 1] < heap[minimum - 1]) inimum = left;
        if(minimum != i) {
            temp = heap[i - 1];
            heap[i - 1] = heap[minimum - 1];
            heap[minimum - 1] = temp;
            i = minimum;
        }else break;
    }while(i <= size/2)
}
function buildMinHeap(heap, size){
    for(let i = floor(size / 2) - 1; i >= 0; i --){
        minHeapify(heap, i, size);
    }
}
function minHeapSort(arr, size){
    var temp;
    buildMinHeap(arr, size);
    for(let i = size - 1; i >= 1; i --){
        temp = arr[i];
        arr[i] = arr[0];
        arr[0] = temp;
        minHeapify(arr, 0, i);
    }
    return arr;
}