module.exports = ({
    helper,
    functionParser
}) => {
    const replaceToEqual = (input = "") => input.replace(/<=|>=|<|>/, "=")

    const addSpacingVar = (input = {}) => `xF${input.index} + ${input.value}`

    const restrictionPipe = helper.createPipe(
        addSpacingVar,
        replaceToEqual,
        functionParser.parseLinearFunction
    )

    const parseRestriction = restrictionStr => restrictionPipe(restrictionStr)

    return {
        parseRestriction
    }
}