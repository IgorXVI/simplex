module.exports = ({
    log
}) => {
    const makeVarsStr = varObj => Object
        .keys(varObj)
        .map(oneVar => `${oneVar} = ${varObj[oneVar]}`)
        .join("\n")

    const makeZPresentation = ZResult => `Valor otimo para Z: ${ZResult}`

    const makeBasicVarsPresentation = basicVars => 
        `Variaveis basicas:\n${makeVarsStr(basicVars)}`

    const makeNonBasicVarsPresentation = nonBasicVars => 
        `Variaveis nao basicas:\n${makeVarsStr(nonBasicVars)}`

    const present = ({
        ZResult,
        basicVars,
        nonBasicVars
    }) => {
        log(`\n${makeZPresentation(ZResult)}\n${makeBasicVarsPresentation(basicVars)}\n${makeNonBasicVarsPresentation(nonBasicVars)}`)
    }

    return {
        present
    }
}