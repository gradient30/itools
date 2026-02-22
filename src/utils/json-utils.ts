export interface JsonValidationResult {
    isValid: boolean;
    correctedJson?: string;
    fixes: string[];
    isSuccessfullyFixed: boolean;
    error?: {
        message: string;
        line: number;
        column: number;
    };
}

export function tryFixJson(input: string): { fixed: string; fixes: string[]; isSuccessfullyFixed: boolean } {
    const fixes: string[] = [];
    let fixed = input.trim();

    if (fixed.includes("'") && !fixed.includes('"')) {
        const newFixed = fixed.replace(/'/g, '"');
        try {
            JSON.parse(newFixed);
            fixed = newFixed;
            fixes.push("将单引号转换为双引号");
        } catch { /* */ }
    }

    const unquotedKeyPattern = /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
    if (unquotedKeyPattern.test(fixed)) {
        const newFixed = fixed.replace(unquotedKeyPattern, '$1"$2":');
        const hadChange = newFixed !== fixed;
        fixed = newFixed;
        try {
            JSON.parse(fixed);
            if (hadChange) fixes.push("为对象键添加双引号");
        } catch { /* */ }
    }

    const trailingCommaPattern = /,(\s*[}\]])/g;
    if (trailingCommaPattern.test(fixed)) {
        const newFixed = fixed.replace(trailingCommaPattern, '$1');
        const hadChange = newFixed !== fixed;
        fixed = newFixed;
        try {
            JSON.parse(fixed);
            if (hadChange) fixes.push("移除尾随逗号");
        } catch { /* */ }
    }

    const unquotedValuePattern = /:(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*([,}])/g;
    if (unquotedValuePattern.test(fixed)) {
        const newFixed = fixed.replace(unquotedValuePattern, ':"$2"$3');
        const hadChange = newFixed !== fixed;
        fixed = newFixed;
        try {
            JSON.parse(fixed);
            if (hadChange) fixes.push("为字符串值添加双引号");
        } catch { /* */ }
    }

    if (fixed.includes('//') || fixed.includes('/*')) {
        const newFixed = fixed.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        const hadChange = newFixed !== fixed;
        fixed = newFixed;
        try {
            JSON.parse(fixed);
            if (hadChange) fixes.push("移除注释");
        } catch { /* */ }
    }

    let isSuccessfullyFixed = false;
    try {
        JSON.parse(fixed);
        if (fixes.length > 0) fixes.push("JSON 已修复");
        isSuccessfullyFixed = true;
    } catch {
        isSuccessfullyFixed = false;
    }

    return { fixed, fixes, isSuccessfullyFixed };
}

export function validateJson(input: string): JsonValidationResult {
    if (!input.trim()) return { isValid: true, fixes: [], isSuccessfullyFixed: true };

    try {
        JSON.parse(input);
        return { isValid: true, fixes: [], isSuccessfullyFixed: true };
    } catch (e) {
        const error = e as Error;
        const message = error.message;
        const positionMatch = message.match(/position\s+(\d+)/i);
        const position = positionMatch ? parseInt(positionMatch[1]) : 0;
        const lines = input.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        const fixResult = tryFixJson(input);
        if (fixResult.isSuccessfullyFixed && fixResult.fixes.length > 0) {
            return {
                isValid: false,
                correctedJson: fixResult.fixed,
                fixes: fixResult.fixes,
                isSuccessfullyFixed: true
            };
        }

        return {
            isValid: false,
            fixes: [],
            isSuccessfullyFixed: false,
            error: { message, line, column }
        };
    }
}
