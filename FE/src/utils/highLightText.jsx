function highlightText(chunk, keywords, fontSize, fontFamily, isChapterHeading, options = {}) {
    const {
        highlightColor = 'yellow',
        highlightEntireLine = false,
        caseSensitive = false,
        wholeWordOnly = false,
        multiLineHighlight = false,
    } = options;

    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    const validKeywords = keywordArray.filter(kw => kw && kw.trim());

    const normalize = str => (caseSensitive ? str : str.toLowerCase());

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const isMatch = (text, keyword) => {
        const pattern = wholeWordOnly
            ? `\\b${escapeRegex(keyword)}\\b`
            : escapeRegex(keyword);
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(pattern, flags);
        return regex.test(text);
    };

    const highlightWordsInLine = (line) => {
        let parts = [line];

        validKeywords.forEach(keyword => {
            const newParts = [];

            parts.forEach(part => {
                if (typeof part !== 'string') return newParts.push(part);

                const pattern = wholeWordOnly
                    ? `\\b(${escapeRegex(keyword)})\\b`
                    : `(${escapeRegex(keyword)})`;
                const flags = caseSensitive ? 'g' : 'gi';
                const regex = new RegExp(pattern, flags);

                const splitParts = part.split(regex);

                splitParts.forEach((split, index) => {
                    if (split === '') return;

                    const isHighlighted = normalize(split) === normalize(keyword);
                    if (isHighlighted) {
                        newParts.push({ text: split, isHighlighted: true });
                    } else {
                        newParts.push(split);
                    }
                });
            });

            parts = newParts;
        });

        return parts;
    };

    // Xác định các dòng cần highlight toàn dòng nếu multiLineHighlight được bật
    const linesToHighlight = new Set();
    if (multiLineHighlight) {
        chunk.forEach((line, idx) => {
            if (validKeywords.some(kw => isMatch(normalize(line), normalize(kw)))) {
                linesToHighlight.add(idx);
            }
        });
    }

    return chunk.map((line, i) => {
        const shouldHighlight = validKeywords.some(kw => isMatch(normalize(line), normalize(kw)));
        const highlightLine = (highlightEntireLine || linesToHighlight.has(i)) && shouldHighlight;

        if (highlightLine) {
            return (
                <span
                    key={i}
                    style={{
                        display: 'block',
                        backgroundColor: highlightColor,
                        fontSize: `${fontSize}px`,
                        fontFamily,
                        fontWeight: isChapterHeading(line) ? 'bold' : '400',
                        margin: '0 0 10px',
                        lineHeight: 1.6,
                        padding: '2px 4px',
                        borderRadius: '3px',
                        cursor: 'text',
                    }}
                >
                    {line}
                </span>
            );
        }

        if (!shouldHighlight) {
            return (
                <span
                    key={i}
                    style={{
                        display: 'block',
                        fontSize: `${fontSize}px`,
                        fontFamily,
                        fontWeight: isChapterHeading(line) ? 'bold' : '400',
                        margin: '0 0 10px',
                        lineHeight: 1.6,
                        cursor: 'text',
                    }}
                >
                    {line}
                </span>
            );
        }

        const parts = highlightWordsInLine(line);

        return (
            <span
                key={i}
                style={{
                    display: 'block',
                    fontSize: `${fontSize}px`,
                    fontFamily,
                    fontWeight: isChapterHeading(line) ? 'bold' : '400',
                    margin: '0 0 10px',
                    lineHeight: 1.6,
                    cursor: 'text',
                }}
            >
                {parts.map((part, j) =>
                    typeof part === 'string' ? (
                        <span key={j}>{part}</span>
                    ) : (
                        <span
                            key={j}
                            style={{
                                backgroundColor: highlightColor,
                                padding: '0 2px',
                                borderRadius: '2px',
                            }}
                        >
                            {part.text}
                        </span>
                    )
                )}
            </span>
        );
    });
}

export default highlightText;