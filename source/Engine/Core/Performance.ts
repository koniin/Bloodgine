export function clearObject(obj) {
    let keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
        let p = keys[i];
		if (obj.hasOwnProperty(p)) delete obj[p];
	}
}

export function arrayRemove(arr:any[], index:number) {
    for (var i = index, len = arr.length - 1; i < len; i++)
	    arr[i] = arr[i + 1];
    arr.length = len;
}

export function arrayRemoveItem(arr:any[], item:any) {
    let index = arr.indexOf(item);
    if(index < 0) return;
    arrayRemove(arr, index);
}

export function arrayRemoveMany(arr:any[], items:any[]) {
    for(let item of items)
        arrayRemoveItem(arr, item);
}