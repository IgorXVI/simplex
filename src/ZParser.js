module.exports = ({
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

    const parseZ = zBodyString => {
        const zBodyStringWithZero = addEqualZero(zBodyString)

        const fun = functionParser.parseLinearFunction(zBodyStringWithZero)

        const funWithInvertedSigns = invertSigns(fun)

        const funWithZ = addVarZ(funWithInvertedSigns)

        return funWithZ
    }

    return {
        parseZ
    }
}