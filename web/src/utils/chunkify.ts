export const chunkify = (kvArray: any, chunkSize: number = 10) => {
    if(kvArray.length === 0) {
        return [[]]
    } else if(kvArray.length <= chunkSize) {
        return [kvArray]
    } else {
        return kvArray.reduce((agg: any, curr: any, index: number) => {
            const chunkIndex = Math.floor(index / chunkSize)
            if(!agg[chunkIndex]) {
              agg[chunkIndex] = [] // create a new chunk
            }
            agg[chunkIndex].push(curr)
            return agg
        }, [])
    }
}

export default chunkify