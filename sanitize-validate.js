const url = require('url')

function validateRequest(req, res, next) {
    console.log(req.body)
    if (!req.body) {
        res.status(400).send('no request body, make requests using json bodies')
        return
    } else if (!req.body.url) {
        res.status(400).send('no request url')
        return
    } else if (isNaN(req.body.num_of_images)) {
        res.status(400).send('please request a number of images as an integer')
        return
    }
    const request = url.parse(req.body.url)

    if (request.protocol != 'https:' && request.protocol != 'http:') {
        res.status(400).send('please provide the complete url: https://...')
        return
    } else if (request.query) {
        res.status(400).send('please omit any queries from url')
        return
    } else if (request.hash) {
        res.status(400).send('please omit any hashes from url')
        return
    } else if (request.search) {
        res.status(400).send('please omit any searches from url')
        return
    } else if (request.port) {
        res.status(400).send('please omit any ports from url')
        return
    } else if (!request.href.includes('www.reddit.com')) {
        res.status(400).send('please format requested url as https://www.reddit.com/r/...')
        return
    } else if (!request.path.includes('/r/')) {
        res.status(400).send('please request a specific subreddit')
        return
    } else {
        req.locals = { ...request, num_of_images: req.body.num_of_images }
        next()
    }
}

function sanitizeRequest(req, res, next) {
    const { href, num_of_images } = req.locals
    let { path } = req.locals

    path = path.slice(3, path.length)
    if (path[path.length - 1] == '/') {
        path = path.slice(0, path.length - 1)
    }

    if (num_of_images > 50) {
        num_of_images = 50
    }

    req.locals = {
        url: href,
        subreddit: path,
        num_of_images: num_of_images
    }
    next()
}

module.exports = {
    sanitize: sanitizeRequest,
    validate: validateRequest
}
