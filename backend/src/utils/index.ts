export function updateInstance(instance: any, update: any) {
    for (const [key, value] of Object.entries(instance)) {
        instance[key] = update[key] ? update[key] : value;
    }
    return instance;
}

export function toLower(v: string) {
    return v.toLowerCase();
}
