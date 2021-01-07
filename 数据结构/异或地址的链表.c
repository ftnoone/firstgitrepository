#include <stdio.h>
#include <stdlib.h>


//总结：
//优点：减少空间的使用
//缺点：只能从头部开始遍历（因为存有头部地址），即遍历时必须有前置节点的地址或后置节点的地址，才能遍历


//结构体声明 
typedef struct listNode{
	void* address;//存放节点的前置节点和后置节点的异或 
	int key;//节点的键值 
} listNode;//链表的节点 
typedef struct linkedList{
	listNode* head;//链表头 
} linkedList;//链表 

//全局变量声明 
listNode **deleteResult = NULL;//专门给deleteNode函数用的指针数组 

//函数声明 
void freeList(linkedList* l); 
void randomInsertList(linkedList* l, int n);
void insertNode(linkedList* l, int key);
void searchNode(linkedList* l, int key, listNode** result);
int deleteNode(linkedList* l, int key, int* a);
void reverseList(linkedList* l);
void showList(linkedList* l);

int main(){
	
	deleteResult = (listNode**)malloc(sizeof(listNode*) * 2);
	linkedList* l = (linkedList*)malloc(sizeof(linkedList));
	listNode *node, **result = (listNode**)malloc(sizeof(listNode*) * 2);
	l->head = NULL;
	int num, key, *a = (int*)malloc(sizeof(int));
	
	while(1){
		printf("请输入操作：0（退出），1（插入节点），2（删除节点），3（查询节点），4（展示链表），5（随机插入节点），6（反转链表）\n> ");
		scanf("%d", &num);
		switch(num){
			case 0: break;
			case 1: {
				printf("请输入插入的key值：\n> ");
				scanf("%d", &key);
				insertNode(l, key);
				printf("OK !\n");
				continue;
			}
			case 2:{
				printf("请输入删除的key值：\n> ");
				scanf("%d", &key);
				key = deleteNode(l, key, a);
				if(key != -1){
					printf("已删除节点：%d\n", *a);
				}else printf("没有这个节点\n"); 
				continue;
			}
			case 3:{
				printf("请输入搜索的key值：\n> ");
				scanf("%d", &key);
				searchNode(l, key, result);
				if(result[0] != NULL){
					printf("节点：%d\n", result[0]->key);
				}else printf("没有这个节点\n"); 
				continue;
			}
			case 4:{
				showList(l); 
				continue;
			}
			case 5:{
				printf("请输入要插入链表的节点数目：\n> ");
				scanf("%d", &key);
				randomInsertList(l, key);
				printf("OK !\n");
				continue;
			}
			case 6:{
				reverseList(l); 
				printf("OK !\n");
				continue;
			}
		}
		break;
	}
	freeList(l);
	free(l);
	free(a);
	free(deleteResult);
	free(result); 
	return 0;
} 

//功能：删除节点
//参数：（@1链表地址；@2删除的节点的int键值；@3存放键值的int指针） 
//返回：-1代表没找到，0代表找到 
int deleteNode(linkedList* l, int key, int* a){
	searchNode(l, key, deleteResult);
	listNode *prev = deleteResult[1], *node = deleteResult[0], *behind;
	if(node == NULL) return -1;
	else{
		*a = node->key;
		behind = (listNode*)((unsigned long)(node->address) ^ (unsigned long)prev);//指针转换为无符号长整型才能做异或运算 ，然后再转换回来 
		if(prev == NULL){//prev为空说明是头结点，只有头结点的前置节点为空 
			l->head = (listNode*)(node->address);
		} else{
			prev->address = (void*)((unsigned long)(prev->address) ^ (unsigned long)node ^ (unsigned long)behind);//前置节点prev的addrss异或node节点得到前置节点prev的前置节点地址，和后置节点behind异或存入前置节点prev的address 
		}
		if(behind != NULL) behind->address = (void*)((unsigned long)(behind->address) ^ (unsigned long)node ^ (unsigned long)prev);//对后置节点behind的address 处理然后释放节点node的空间 
		free(node);
	}
	return 0;
}

//功能：查询链表中节点值等于key的节点
//参数：（@1链表地址；@2查找的int键值；@3存放结果的前置节点和节点的指针数组，包含两个元素，第一个是要查询的节点，第二个是前置节点） 
//返回：无 
void searchNode(linkedList* l, int key, listNode** result){
	listNode *node = l->head, *prev = NULL, *temp;
	while(node != NULL && node->key != key){//在搜索完节点或者节点值等于key时退出循环 
		temp = (listNode*)((unsigned long)prev ^ (unsigned long)(node->address));//一个地址放两个地址的异或，需要异或前置节点得到后置节点的地址 
		prev = node;
		node = temp;
	}
	result[0] = node;
	result[1] = prev;
}

//功能：在链表头部插入节点
//参数：（@1链表指针；@2插入的int键值）
//返回：无 
void insertNode(linkedList* l, int key){
	listNode *node = (listNode*)malloc(sizeof(listNode));
	node->key = key;
	node->address = l->head;
	if(l->head != NULL) l->head->address = (void*)((unsigned long)node ^ (unsigned long)(l->head->address));
	l->head = node;
}

//功能：在链表头处中随机插入n个值 
//参数：（@1链表地址；@2随机插入节点的节点数量int）
//返回：无 
void randomInsertList(linkedList* l, int n){
	srand((unsigned)time(NULL));
	int i = 1;
	listNode *node, *prev = NULL, *head;
	node = (listNode*)malloc(sizeof(listNode));//这里分配一个节点防止链表头为空 
	node->key = rand();
	printf("插入节点：%d\n", node->key);
	node->address = l->head;
	if(l->head != NULL) l->head->address = (void*)((unsigned long)node ^ (unsigned long)(l->head->address));
	l->head = node;
	for(; i < n; i ++){
		node = (listNode*)malloc(sizeof(listNode));
		node->key = rand();
		printf("插入节点：%d\n", node->key);
		node->address = l->head;
		l->head->address = (void*)((unsigned long)node ^ (unsigned long)(l->head->address));
		l->head = node;
	}
}

//功能：释放整个链表
//参数：（@1链表地址）
//返回：无 
void freeList(linkedList* l){
	listNode *node = l->head, *prev = NULL, *temp;
	while(node != NULL){
		temp = (listNode*)((unsigned long)(node->address) ^ (unsigned long)prev);
		prev = node;
		free(node);
		node = temp;
	}
}

//功能：展示整个链表（在控制台中打印出来）
//参数：（@1链表地址）
//返回：无
void showList(linkedList* l){
	listNode *node = l->head, *prev = NULL, *temp;
	printf("链表：");
	while(node != NULL){
		printf("%d -> ", node->key);
		temp = (listNode*)((unsigned long)(node->address) ^ (unsigned long)prev);
		prev = node;
		node = temp;
	}
	printf("\n");
} 

//功能：反转链表
//参数：（@1链表地址）
//返回：无
void reverseList(linkedList* l){
	listNode *node = l->head, *prev = NULL, *temp;
	while(node != NULL){
		temp = (listNode*)((unsigned long)(node->address) ^ (unsigned long)prev);
		prev = node;
		node = temp;
	}
	if(prev != NULL) {
		l->head = prev;
	}
} 
