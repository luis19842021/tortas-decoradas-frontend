export async function verificarAdmin(authorizationHeader: string | null): Promise<boolean> {
    if (!authorizationHeader) {
        return false;
    }

    try {
        const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verificarAdmin`, {
            headers: { Authorization: authorizationHeader },
        });
        return respuesta.ok;
    } catch {
        return false;
    }
}
