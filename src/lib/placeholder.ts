/** True when the whole string is a "[PLACEHOLDER]" marker. */
export const isPlaceholder = (text: string): boolean => /^\[[^\]]+\]$/.test(text.trim());

/** True when the string contains at least one "[PLACEHOLDER]" marker. */
export const hasPlaceholder = (text: string): boolean => /\[[^\]]+\]/.test(text);
