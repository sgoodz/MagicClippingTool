const request = require('request'); //request
const fs = require('fs'); //filesystem
const imageNames = fs.readdirSync("./images"); //read the file names of the directory


//for each imageName run the clipping script//
imageNames.forEach((file) => {
    const imgName = "./images/" + file;
    request.post({
        url: 'https://clippingmagic.com/api/v1/images',
        formData: {
            image: fs.createReadStream(imgName), //image dir
            format: 'result',
            test: 'true', //watermarks
        },
        auth: {
            user: '123',
            pass: '[secret]'
        },
        followAllRedirects: true,
        encoding: null
    }, function (error, response, body) {
        if (error) {
            console.error('Request failed:', error);
        } else if (!response || response.statusCode != 200) {
            console.error('Error:', response && response.statusCode, body.toString('utf8'));
        } else {
            // Store these if you want to be able to use the Smart Editor
            let imageId = response.caseless.get('x-amz-meta-id');
            let imageSecret = response.caseless.get('x-amz-meta-secret');

            // Save result
            fs.writeFileSync("clipped.png", body);
        }
    })
});