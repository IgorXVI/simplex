module.exports = ({
    helper,
    functionParser
}) => {
    const addEqualZero = input => `${input} = 0`

    const addVarZ = input => ({
        ...input,
        Z: 1
    })

    const invertSigns = (input = {}) => Object
        .keys(input)
        .reduce((obj, key) => {
            const multNum = key === "B" ? 1 : -1

            obj[key] = input[key] * multNum

            return obj
        }, {})

    const ZPipe = helper.createPipe(
        addEqualZero,
        functionParser.parseLinearFunction,
        invertSigns,
        addVarZ
    )

    const parseZ = zBodyString => ZPipe(zBodyString)

    return {
        parseZ
    }
}