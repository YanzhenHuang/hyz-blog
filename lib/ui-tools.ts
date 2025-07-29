export const scrollToTop = (
    canScrollRef: React.RefObject<HTMLDivElement | null>
) => {
    if (!canScrollRef.current)
        return;
    canScrollRef.current.scrollTop = 0;

}

export const scrollToBottom = (
    canScrollRef: React.RefObject<HTMLDivElement | null>
) => {
    if (!canScrollRef.current)
        return;
    canScrollRef.current.scrollTop = canScrollRef.current.scrollHeight;

}