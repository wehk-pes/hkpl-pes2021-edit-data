import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(process.argv[1]);
const WEPES_DIR_PATH = path.join(__dirname, '..', 'WEPES');

function isDir(path) {
    return fs.statSync(path).isDirectory();
}

function readPath(inputPath, callback) {
    if (isDir(inputPath)) {
        const fileNames = fs.readdirSync(inputPath);

        fileNames.forEach((fileName) => {
            const filePath = path.join(inputPath, fileName);
            readPath(filePath, callback);
        });
    } else {
        callback(inputPath);
    }
}

export default function clean(isForSmallStrip = false, isForCantonese = false) {
    readPath(WEPES_DIR_PATH, (filePath) => {
        const isCedFile = filePath.endsWith('.ced');
        const isTedFile = filePath.endsWith('.ted');
        const isCantoneseFile = filePath.endsWith('_yue.ced') || filePath.endsWith('_yue.ted');
        const isSmallStripTedFile = filePath.endsWith('_s_yue.ted') || filePath.endsWith('_s.ted');
        const isLargeStripTedFile = isTedFile && !isSmallStripTedFile;

        if (!isCedFile && !isTedFile) {
            // 跳過唔係ced同ted嘅檔案
            // If the file is not a *.ced file nor *.ted file, skip it.
            return;
        }

        let shouldDeleteFile = false;

        if ((isForCantonese && !isCantoneseFile) || (!isForCantonese && isCantoneseFile)) {
            shouldDeleteFile = true;
        }

        if (isForSmallStrip && isLargeStripTedFile || !isForSmallStrip && isSmallStripTedFile) {
            shouldDeleteFile = true;
        }

        if (shouldDeleteFile) {
            fs.unlinkSync(filePath);
        }
    });
}
