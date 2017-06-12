// @todo context should be provided to the recorder
const AUDIO_CONTEXT = new AudioContext();

const AudioBufferPlayer = function (buffer) {
    this.buffer = buffer;
    this.source = null;
};

AudioBufferPlayer.prototype.play = function (onEnded) {
    this.source = AUDIO_CONTEXT.createBufferSource();
    this.source.onended = onEnded;
    this.source.buffer = this.buffer;
    this.source.connect(AUDIO_CONTEXT.destination);
    this.source.start();
};

AudioBufferPlayer.prototype.stop = function () {
    if (this.source) this.source.stop();
};

AudioBufferPlayer.prototype.getData = function () {
    return this.buffer.getChannelData(0);
};

module.exports = AudioBufferPlayer;
