/* Replaces all occurrences of '/' with '..', which is illegal in email addresses,
 * and breaks the address into directories on filename limit boundaries
 */
export function fsEscape(email) {
    let escaped = email.replace(/[/]/g, "..");
    let path = "";
    while (escaped) {
        path += "/" + escaped.slice(0, 255);
        escaped = escaped.slice(256);
    }
    return path;
}
