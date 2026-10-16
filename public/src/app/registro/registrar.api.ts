import { apiFetch } from "@/utils/apiFetch";

export async function getProducts() {
    const data = await apiFetch("/usuario", {
         method:'POST'

    });
    return  data.json();

}
