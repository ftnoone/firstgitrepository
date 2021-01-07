var floor = Math.floor;
function maxHeapify(heap, i, size){
    var left, right, maximum, temp;
    i ++;
    do{
        left = 2*i;
        right = left + 1;
        if(right <= size && heap[right - 1] > heap[i - 1]) maximum = right;
        else maximum = i;
        if(left <= size && heap[left - 1] > heap[maximum - 1]) maximum = left;
        if(maximum != i) {
            temp = heap[i - 1];
            heap[i - 1] = heap[maximum - 1];
            heap[maximum - 1] = temp;
            i = maximum;
        }else break;
    }while(i <= size/2)
}
function buildMaxHeap(heap, size){
    for(let i = floor(size / 2) - 1; i >= 0; i --){
        maxHeapify(heap, i, size);
    }
}
function maxHeapSort(heap){
    var size = heap.length, temp;
    buildMaxHeap(heap, size);
    for(let i = size - 1; i >= 1; i --){
        temp = heap[i];
        heap[i] = heap[0];
        heap[0] = temp;
        maxHeapify(heap, 0, i);
    }
    return heap;
}