const hoverAllowed = window.matchMedia(
    '(any-hover: hover) and (prefers-reduced-motion: no-preference)'
);

for (const video of document.querySelectorAll('video[data-hover-preview]')) {
    let hoverPlaying = false;
    let hasUsedControls = false;

    const stopHover = () => {
        if (!hoverPlaying) return;
        hoverPlaying = false;
        video.pause();
    };

    const useControls = () => {
        hasUsedControls = true;
        hoverPlaying = false;
    };

    video.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse' || !hoverAllowed.matches ||
            hasUsedControls || !video.paused) return;

        hoverPlaying = true;
        video.muted = true;
        if (video.ended) video.currentTime = 0;
        video.play().catch(() => {});
    });
    video.addEventListener('pointerleave', stopHover);
    video.addEventListener('pointercancel', stopHover);
    video.addEventListener('pointerdown', useControls);
    video.addEventListener('keydown', useControls);
    hoverAllowed.addEventListener('change', () => {
        if (!hoverAllowed.matches) stopHover();
    });
}
