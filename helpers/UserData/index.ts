let data = typeof window !== "undefined" ? localStorage.getItem("user") : "";
let hotelID = typeof window !== "undefined" ? localStorage.getItem("hotelID") : "";
const userSession = typeof window !== "undefined" ? (data !== null && data !== "" ? JSON.parse(data) : "") : null;
let token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

export { userSession, token, hotelID };
