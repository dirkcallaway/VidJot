if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: `mongodb+srv://matt:${process.env.DB_PASS}@cluster0-omiib.mongodb.net/test?retryWrites=true&w=majority`
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}