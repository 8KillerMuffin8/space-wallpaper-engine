const mediaElement = document.getElementById('media')

function wallpaperMediaPropertiesListener(event) {
    const artist = event.artist;
    const title = event.title;
    const album = event.albumTitle;
    mediaElement.innerText = `${title}
    ${album}
    ${artist}`

}
window.wallpaperRegisterMediaPropertiesListener(wallpaperMediaPropertiesListener);
window.wallpaperRegisterMediaStatusListener(wallpaperAudioListener);