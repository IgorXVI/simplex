module.exports = () => {
    const lineOps = opsFun => ({ allVars, line, number }) => allVars.reduce((hash, oneVar) => {
        hash[oneVar] = opsFun({ varValue: line[oneVar], number })
        return hash
    }, {})

    const divideLine = lineOps(({ varValue, number }) => varValue / number)

    const multiplyLine = lineOps(({ varValue, number }) => varValue * number)

    const sumLines = ({ allVars, line1, line2 }) => allVars.reduce((hash, oneVar) => {
        hash[oneVar] = line1[oneVar] + line2[oneVar]
        return hash
    }, {})

    const extractAllFuns = ({ Z, restrictions }) => [Z, ...restrictions]

    const extractAllVars = allFuns => Object.keys(
        allFuns
            .map(fun => Object.keys(fun))
            .reduce((allKeys, keys) => allKeys.concat(keys), [])
            .reduce((hash, key) => {
                hash[key] = true
                return hash
            }, {})
    )

    const makeTable = ({ allVars, allFuns }) => allFuns
        .map(
            fun => allVars.reduce(
                (hash, oneVar) => {
                    hash[oneVar] = fun[oneVar] || 0
                    return hash
                },
                {}
            )
        )

    const findMinVar = ({ allVars, table }) => allVars.reduce(
        (currVar, oneVar) =>
            table[0][oneVar] < table[0][currVar] ?
                oneVar
                : currVar
        ,
        allVars[0]
    )

    const findMainLineObj = ({ table, minVar }) => table.reduce(
        (currObj, line, lineIndex) => {
            if (lineIndex === 0 || line[minVar] === 0) {
                return currObj
            }

            const lineValue = Math.abs(line["B"] / line[minVar])

            return lineValue < currObj.value ?
                { index: lineIndex, value: lineValue }
                : currObj
        }
        ,
        { index: -1, value: Infinity }
    )

    const extractMainLineValue = ({
        table,
        mainLineObj,
        minVar
    }) => table[mainLineObj.index][minVar]

    const makeNewMainLine = ({
        allVars,
        table,
        mainLineValue,
        mainLineObj
    }) => divideLine({
        allVars,
        number: mainLineValue,
        line: table[mainLineObj.index]
    })

    const processLine = ({
        line,
        minVar,
        newMainLine,
        allVars
    }) => {
        const mainValueForThis = multiplyLine({
            line: newMainLine,
            number: line[minVar] * (-1),
            allVars
        })

        const newLineValue = sumLines({
            line1: mainValueForThis,
            line2: line,
            allVars
        })

        return newLineValue
    }

    const makeNewLinesRetrictions = ({
        table,
        mainLineObj,
        minVar,
        newMainLine,
        allVars
    }) => table
        .filter((_, index) => index !== mainLineObj.index)
        .map(line => processLine({
            line,
            minVar,
            newMainLine,
            allVars
        }))

    const makeNewTable = ({
        newLinesRetrictions,
        newMainLine
    }) => [...newLinesRetrictions, newMainLine]

    const calcNextSimplexTable = ({
        table,
        allVars
    }) => {
        const minVar = findMinVar({
            allVars,
            table
        })

        const mainLineObj = findMainLineObj({
            minVar,
            table
        })

        const mainLineValue = extractMainLineValue({
            mainLineObj,
            minVar,
            table
        })

        const newMainLine = makeNewMainLine({
            allVars,
            mainLineValue,
            mainLineObj,
            table
        })

        const newLinesRetrictions = makeNewLinesRetrictions({
            mainLineObj,
            minVar,
            newMainLine,
            table,
            allVars
        })

        const newTable = makeNewTable({
            newLinesRetrictions,
            newMainLine
        })

        return newTable
    }

    const testTableFail = ({
        table,
        allVars
    }) => {
        const lineZ = table.find(line => line.Z === 1)

        return allVars.some(oneVar => lineZ[oneVar] < 0)
    }

    const getResult = table => table.find(line => line.Z === 1).B

    const invalidVars = {
        "Z": true,
        "B": true
    }

    const findBasicVars = ({ table, allVars }) => allVars
        .filter(oneVar =>
            !invalidVars[oneVar] &&
            table.every(line => line[oneVar] === 0 || line[oneVar] === 1)
        )
        .reduce((hash, basicVar) => {
            hash[basicVar] = table.find(line => line[basicVar] === 1).B
            return hash
        }, {})

    const findNonBasicVars = ({ allVars, basicVars }) => allVars
        .filter(oneVar => !invalidVars[oneVar] && basicVars[oneVar] === undefined)
        .reduce((hash, nonBasicVar) => {
            hash[nonBasicVar] = 0
            return hash
        }, {})

    const makeResult = ({
        table,
        allVars
    }) => {
        const ZResult = getResult(table)

        const basicVars = findBasicVars({
            allVars,
            table
        })

        const nonBasicVars = findNonBasicVars({
            allVars,
            basicVars
        })

        const result = {
            ZResult,
            basicVars,
            nonBasicVars
        }

        return result
    }

    const calcSimplex = ({
        Z,
        restrictions
    }) => {
        const allFuns = extractAllFuns({
            Z,
            restrictions
        })

        let priority = {
            Z: -Infinity,
            B: Infinity
        }

        const getPriority = oneVar => priority[oneVar] || 1

        const allVars = extractAllVars(allFuns)
            .sort((a, b) => getPriority(a) - getPriority(b))

        let table = makeTable({
            allFuns,
            allVars
        })
        let result

        while (testTableFail({ table, allVars })) {
            const newTable = calcNextSimplexTable({
                allVars,
                table
            })

            table = newTable

            result = makeResult({
                allVars,
                table
            })
        }

        return result
    }

    return {
        calcSimplex
    }
}