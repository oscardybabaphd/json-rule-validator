export class Utils {

    public static extractTextFromHTML(html: string): string {
        if (!/<[a-z][\s\S]*>/i.test(html)) {
            return html;
        }
        const regex = /<[^>]*>/g;
        const text = html.replace(regex, '');
        return text?.trim();
    }
}