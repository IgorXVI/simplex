/* 
Regras:
1 - deve ser de maximização

2 - todas restrições <=

3 - não negatividade


Passos:
1 - Igualar função objetivo a 0, mantendo o Z positivo

2 - transformar restrições em equações com variável de folga somadas no fim

3 - construir tabela de cálculo com o cabeçalho de cada coluna sendo
    uma variável, incluindo varivaveis de folga, o Z,
    e o B sendo o resultado de cada equação

4 - cada linha da tabela é uma equação (incluindo função objetivo),
    com o valor de cada coluna sendo o índice para cada variável na equação,
    se a equação não tiver a variável, o índice é 0

5 - indentificar posição na tabela da variavel que entra: a que tem o menor valor negativo na linha Z

6 - dividir os Bs pelo número na mesma linha na coluna da variável que entra

7 - o B dividido pela variável que entra que tiver o menor valor vai ser a variável que sai

8 - identificar elemento pivo: está no cruzamento da coluna da variável que entra com
    a coluna da variável que sai

9 - dividir linha que tem a variável que sai pelo elemento pivo

10 - linha que foi dividida vai substituir a linha antiga e é a nova linha pivo

11 - calcular novos valores para as outras linhas

12 - multiplicar a linha pivo pelo inverso da variavel da coluna que entra na nova linha que vai ser calculada

13 - somar linha que vai ser calculada com a linha pivo que foi multiplicada no passo 12

14 - resultado vai substituir a linha que foi calculada na nova tabela

15 - repetir passos 12, 13 e 14 para todas as linhas que não foram calculadas

16 - construir nova tabela com os resultados

17 - repetir passos 5 a 16 até encontrar solução ótima: nenhum valor negativo na linha do Z

18 - achar variáveis basicas: coluna só tem 0 e 1

19 - zerar variáveis não basicas

20 - converter váriaveis básicas no valor de B

21 - substituir variáveis básicas na equação do Z
*/

const Helper = require("./Helper")
const FunctionParser = require("./FunctionParser")
const RestrictionParser = require("./RestrictionParser")
const ZParser = require("./ZParser")
const Reader = require("./Reader")

const helper = Helper()

const functionParser = FunctionParser()

const restrictionParser = RestrictionParser({
    functionParser,
    helper
})

const zParser = ZParser({
    functionParser,
    helper
})

const reader = Reader({
    readlineSync: {
        question: str => {
            const result = str === "Z = " ?
                "x1 + 2x2 + 3x3"
                : str === "Numero de restricoes: " ?
                    "3"
                    : str === "Restricao 1: " ?
                        "x1 + 2x2 + x3 <= 40"
                        : str === "Restricao 2: " ?
                            "2x1 + 3x2 <= 30"
                            : str === "Restricao 3: " ?
                                "4x2 + 2x3 <= 20"
                                : null

            console.log(`${str}${result}`)

            return result
        }
    },
    restrictionParser,
    zParser
})

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

        const lineValue = line["B"] / line[minVar]

        return lineValue < currObj.value ?
            { index: lineIndex, value: lineValue }
            : currObj
    }
    ,
    { index: -1, value: Infinity }
)

const extractMainLine = ({
    table,
    mainLineObj,
    minVar
}) => table[mainLineObj.index][minVar]

const makeNewMainLine = ({
    allVars,
    table,
    mainLine,
    mainLineObj
}) => divideLine({
    allVars,
    number: mainLine,
    line: table[mainLineObj.index]
})

const processLine = ({
    line,
    minVar,
    newMainLine,
    allVars
}) => {
    const pivoForThis = multiplyLine({
        line: newMainLine,
        number: line[minVar] * (-1),
        allVars
    })

    const newLineValue = sumLines({
        line1: pivoForThis,
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

const calcSimplex = ({
    Z,
    restrictions
}) => {
    const allFuns = extractAllFuns({
        Z,
        restrictions
    })

    const allVars = extractAllVars(allFuns)

    const table = makeTable({
        allFuns,
        allVars
    })

    const minVar = findMinVar({
        allVars,
        table
    })

    const mainLineObj = findMainLineObj({
        minVar,
        table
    })

    const mainLine = extractMainLine({
        mainLineObj,
        minVar,
        table
    })

    const newMainLine = makeNewMainLine({
        allVars,
        mainLine,
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

const Z = reader.readZ()
const restrictions = reader.readRestrictions()

console.log(calcSimplex({
    Z,
    restrictions
}))
