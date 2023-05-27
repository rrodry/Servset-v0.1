const { SECRET }  = require('../config')
const jwt = require('jsonwebtoken')


const getAccessInfo = (e) => {
    return jwt.sign(e, SECRET)
}
module.exports = { 
    getAccessInfo
}