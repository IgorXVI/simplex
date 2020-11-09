module.exports = () => {
    const createPipe =
        (...funs) =>
            input =>
                funs.reduce((prevResult, fun) => fun(prevResult), input)

    return {
        createPipe
    }
}