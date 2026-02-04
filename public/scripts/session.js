export async function getSession() {
    let res = await fetch("/api/auth/session", {
        credentials: "include",
    })

    if (!res.ok) {
        const refreshRes = await fetch("/api/auth/refresh", {
            credentials: "include",
        })

        if (!refreshRes.ok) return null;

        res = await fetch("/api/auth/session", {
            credentials: "include",
        })

        if (!res.ok) return null;
    }
    return res.json();
}