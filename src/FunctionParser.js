module.exports = () => {
    const parseLinearFunctionBody = (input = "x1+2x2-3x3") => input
        .replace(/\s+/g, "")
        .replace(/\+-|-\+/, "-")
        .replace(/\+|-/g, str => `@${str}`)
        .split("@")
        .filter(el => el !== "")
        .reduce((obj, el) => {
            const arr = el
                .replace("+x", "1x")
                .replace("-x", "-1x")
                .split("x")

            const index = arr[1]
            const value = arr[0] === "" ? 1 : parseFloat(arr[0])

            const attr = `x${index}`

            obj[attr] = value

            return obj
        }, {})

    const parseLinearFunction = (input = "") => {
        const [body, result] = input.split("=")

        return {
            ...parseLinearFunctionBody(body),
            B: parseFloat(result)
        }
    }

    return {
        parseLinearFunction
    }
}