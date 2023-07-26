const pick = (obj, keys) => {
    const finalObj = {};

    keys.forEach((key) => {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            // finalObj[key] = obj[key];
            if (obj[key]) {
                finalObj[key] = obj[key];
            }
        }
    });
    return finalObj;
};

module.exports= pick;
