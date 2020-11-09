module.exports = ({
    readlineSync,
    restrictionParser,
    zParser
}) => {
    const { question } = readlineSync

    const readZBodyStr = () => question("Z = ")

    const readZ = () => zParser.parseZ(readZBodyStr())

    const readRestriction = index => ({
        value: question(`Restricao ${index}: `),
        index
    })

    const readNumberOfRestrictions = () => parseInt(question("Numero de restricoes: "))

    const readRestrictions = () => new Array(readNumberOfRestrictions())
        .fill(null)
        .map((_, index) => restrictionParser.parseRestriction(readRestriction(index + 1)))

    return {
        readZ,
        readRestrictions
    }
}