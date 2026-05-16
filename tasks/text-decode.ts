import { TextDecoder } from 'util';

function createGBKDecoder() {
    try {
        return new TextDecoder('gbk');
    } catch (e) {
        return new TextDecoder('gb18030');
    }
}

const decoder = createGBKDecoder();

export function gbkBufferToUtf8(buffer:Buffer) {
    return decoder.decode(buffer);
}
