import axios from "axios"

export default function useApi() {
    var api = {}

    api.post = async function(url, body) {
        const data = await axios.post(process.env.NODE_ENV === 'development' ? "http://localhost:8080/api"+url : "/api"+url, body, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })

        return data
    }

    api.get = async function(url, body) {
        const data = await axios.get(process.env.NODE_ENV === 'development' ? "http://localhost:8080/api"+url : "/api"+url, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })

        return data
    }

    return api
}