export default function formatSessionDate(dateString: string | null | undefined): string {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};