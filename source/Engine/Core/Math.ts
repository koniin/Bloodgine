export function sign(x:number) {
    if (x > 0)
        return 1;
    else if (x < 0)
        return -1;
    else
        return 0;
}

export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val))
}