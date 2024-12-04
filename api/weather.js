module.exports = async function (context, req) {
    context.res = {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            temperature: 22,
            condition: "sunny",
            location: "Helsinki"
        }
    };
}; 