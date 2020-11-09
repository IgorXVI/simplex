module.exports = ({
    helper,
    functionParser
}) => {
    const addEqualZero = input => `${input} = 0`

    const invertSigns = (input = {}) => Object
        .keys(input)
        .reduce((obj, key) => {
            const multNum = key === "equal" ? 1 : -1

            obj[key] = input[key] * multNum

            return obj
        }, {})

    const ZPipe = helper.createPipe(
        addEqualZero,
        functionParser.parseLinearFunction,
        invertSigns
    )

    const parseZ = zBodyString => ZPipe(zBodyString)

    return {
        parseZ
    }
}