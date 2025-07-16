var subdir = '<!--# echo var="subdir" default="" -->';
var subdomain = '<!--# echo var="subdomain" default="" -->';

if (subdomain) {
    subdomain = subdomain.substr(0, subdomain.length - 1).split('.')
        .join('_')
        .toLowerCase() + '.';
}

if (subdir.startsWith('<!--')) {
    subdir = '';
}

if (subdomain.startsWith('<!--')) {
    subdomain = '';
}

var enableJaaS = false;

var config = {
    hosts: {
        domain: 'meet.karstenschneeberger.de',
        muc: 'conference.' + subdomain + 'meet.karstenschneeberger.de',
    },

    bosh: 'https://meet.karstenschneeberger.de/' + subdir + 'http-bind',
    websocket: 'wss://meet.karstenschneeberger.de/' + subdir + 'xmpp-websocket',

    bridgeChannel: {
    },

    testing: {
    },

    enableNoAudioDetection: true,
    enableNoisyMicDetection: true,

    resolution: 1080,
    maxFullResolutionParticipants: 2,

    constraints: {
        video: {
            height: {
                ideal: 720,
                max: 1080,
                min: 240,
            },
        },
    },


    channelLastN: 4,

    hideEmailInSettings: true,
    disableThirdPartyRequests: true,


    p2p: {
        enabled: false,
        stunServers: [
            { urls: 'stun:meet.karstenschneeberger.de:3478' },
        ],
    },

    analytics: {
        disabled: true,
    },


    doNotStoreRoom: true,

};

// Set the default values for JaaS customers
if (enableJaaS) {
    config.dialInNumbersUrl = 'https://conference-mapper.jitsi.net/v1/access/dids';
    config.dialInConfCodeUrl = 'https://conference-mapper.jitsi.net/v1/access';
    config.roomPasswordNumberOfDigits = 10; // skip re-adding it (do not remove comment)
}