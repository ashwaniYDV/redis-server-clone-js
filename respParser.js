const NULL_BULK_STRING = "NULL";
const READ_CACHE_MAX = 8192; // 8 KB
const ITEM_LEN_MAX = 536870912; // 512 MB

class RESPParser {
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
        this.readCache = '';
    }

    async updateCache() {
        const remaining = this.buffer.length - this.offset;
        const chunkSize = Math.min(READ_CACHE_MAX, remaining);
        this.readCache = this.buffer.slice(this.offset, this.offset + chunkSize).toString();
        this.offset += chunkSize;
    }

    async cacheHasValidItem() {
        for (let i = 0; i < this.readCache.length; i++) {
            if (this.readCache[i] === '\r' && this.readCache[i + 1] === '\n') {
                const item = this.readCache.slice(0, i + 2);
                this.readCache = this.readCache.slice(i + 2);
                return item;
            }
        }
        return null;
    }

    async readNextItem() {
        let item = '';

        while (true) {
            const validItem = await this.cacheHasValidItem();
            if (validItem) {
                item += validItem;
                break;
            }
            await this.updateCache();
        }

        return item;
    }

    async readNewRequest() {
        const arrSizeItem = await this.readNextItem();
        const size = parseInt(arrSizeItem.slice(1, -2));

        const req = [];

        for (let i = 0; i < size; i++) {
            const bulkStrSizeItem = await this.readNextItem();
            const bulkStrSize = parseInt(bulkStrSizeItem.slice(1, -2));

            if (bulkStrSize === -1) {
                req.push(NULL_BULK_STRING);
                continue;
            }

            const bulkStrItem = await this.readNextItem();
            const bulkStr = bulkStrItem.slice(0, -2);

            if (bulkStr.length !== bulkStrSize) {
                throw new Error("Bulk string size does not match");
            }

            req.push(bulkStr);
        }

        return req;
    }
}

module.exports = RESPParser;

// Example usage with a buffer
// (async () => {
//     try {
//         // const buffer = Buffer.from("*2\r\n$3\r\nget\r\n$7\r\nashwani\r\n"); // Replace with your buffer
//         const buffer = Buffer.from('*2\r\n$3\r\n900\r\n$1\r\n1\r\n')
//         const parser = new RESPParser(buffer);
//         const request = await parser.readNewRequest();
//         console.log(request);
//     } catch (error) {
//         console.error(error);
//     }
// })();
