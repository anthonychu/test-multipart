// https://github.com/Azure/azure-functions-host/issues/2009#issuecomment-362785945
const multer = require('multer');
const streams = require('memory-streams');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = async function (context, req) {
    const parsed = await processMultipartForm(req);
    context.res.json(parsed.body);
};

function processMultipartForm(req) {
    const stream = new streams.ReadableStream(req.body); 
    for (const key in req) {
        if (req.hasOwnProperty(key)) {
            stream[key] = req[key];
        }
    }

    return new Promise((resolve, reject) => {
        const next = (err) => {
            if (err) {
                reject(err);
            }
            resolve(stream);
        };
        upload.any()(stream, null, next);
    });
}