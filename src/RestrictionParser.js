module.exports = ({
    functionParser
}) => {
    const replaceToEqual = (input = "") => input.replace(/<=|>=|<|>/, "=")

    const addSpacingVar = (input = {}) => `xF${input.index} + ${input.value}`

    const parseRestriction = restrictionStr => {
        const restrictionStrWithSpacingVars = addSpacingVar(restrictionStr)

        const restrictionStrWithEqual = replaceToEqual(restrictionStrWithSpacingVars)

        const fun = functionParser.parseLinearFunction(restrictionStrWithEqual)

        return fun
    }

    return {
        parseRestriction
    }
}