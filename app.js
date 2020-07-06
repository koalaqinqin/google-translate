const fs = require('fs');
const translate = require('google-translate-open-api').default;
const originalFile = './i18n/ko-KR.json';
const _ = require('lodash');

const promiseList = [];
const lang = process.env.LANG_ENV || 'cn';
let toFile = null;
const OPTIONS = {
    tld: 'cn',
    from: 'ko',
};

if (lang === 'en') {
    OPTIONS.to = 'en';
    toFile = './i18n/en-US.json';
} else if (lang === 'ja') {
    OPTIONS.to = 'ja';
    toFile = './i18n/ja-JP.json';
} else {
    OPTIONS.to = 'zh-cn';
    toFile = './i18n/zh-CN.json';
}

const filterObj = (obj, newObj) => {
    for (const key in obj) {
        if (typeof obj[key] !== 'string') {
            newObj[key] = newObj[key] || {};
            filterObj(obj[key], newObj[key]);
        } else if (newObj.hasOwnProperty(key)){
            console.log(key, '--do not translate');
            continue;
        } else {
            promiseList.push(getTranslate(obj[key], newObj, key));
        }
    }
};

const getTranslate = (str, obj, key) => {
    return new Promise((resolve, reject) => {
        translate(str, OPTIONS).then(rs => {
            obj[key] = rs.data;
            // console.log('dddddddddddddd====', obj);
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
};

fs.readFile(originalFile, 'utf8', (error, data) => {
    if (data === '') {
        console.log('no data need translate');
        return false;
    }
    const obj = JSON.parse(data);
    fs.readFile(toFile, 'utf8', (error, toData) => {
        const newObj = toData === '' ? {} : JSON.parse(toData);
        console.log(newObj);
        filterObj(obj, newObj);
        // promiseList
        Promise.all(promiseList).then(rs => {
            fs.writeFile(toFile, JSON.stringify(newObj), (err) => {
                if (err) throw err;
                console.log('文件已被保存');
            });
        });
    });
});