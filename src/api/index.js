import Api from "../services/Api"


export async function contactSubmit(body) {
    console.log("here??")
    const response = await Api.post("/events", {
        body,
    })
    console.log(response)
    return response
}