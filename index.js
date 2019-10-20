const fetch = require("node-fetch");
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video';
const discordApiKey = process.env.DISCORD_API_KEY;
const discordApiUrl = `https://discordapp.com/api/webhooks/${discordApiKey}`;

const youtubeChannels = [
    {
        channelId: 'UCjWk_VRIThkP0fc0A32W2pA',
        channelUrl: 'https://www.youtube.com/channel/UCjWk_VRIThkP0fc0A32W2pA'
    },
    {
        channelId: 'UCqSqR9Jvs3vg7ca40AXQVlA',
        channelUrl: 'https://www.youtube.com/channel/UCqSqR9Jvs3vg7ca40AXQVlA'
    },
    {
        channelId: 'UCbQJCNOoBuTOob7W-wXX4Ng',
        channelUrl: 'https://www.youtube.com/channel/UCbQJCNOoBuTOob7W-wXX4Ng'
    },
    {
        channelId: 'UCLReV54sPZ_oXMEwarxItLA',
        channelUrl: 'https://www.youtube.com/channel/UCLReV54sPZ_oXMEwarxItLA'
    }
];

let activeLiveStreams = new Set();

async function pollForLiveStreamData() {
    try {
        console.log(youtubeApiKey);
        for(const youtubeChannel of youtubeChannels) {
            console.log('Polling for ', JSON.stringify(youtubeChannel));
            const response = await fetch(`${youtubeApiUrl}&channelId=${youtubeChannel.channelId}&key=${youtubeApiKey}`);
            const myJson = await response.json();

            if(myJson && myJson.pageInfo && myJson.pageInfo.totalResults > 0) {
                console.log('Found active stream for ', youtubeChannel.channelId);
                console.log(myJson.items);
                myJson.items.forEach(element => {
                    if(!activeLiveStreams.has(element.id.videoId)) {
                        activeLiveStreams.add(element.id.videoId);
    
                        const discordObj = {
                            username: 'Dumpster LIVE',
                            avatar_url: 'https://yt3.ggpht.com/a/AGF-l7__zvPRgglwpeA85-NPjkxRlhi46IG3wKdwKg=s288-c-k-c0xffffffff-no-rj-mo',
                            content: `Richlife is LIVE. **${element.snippet.title}**. Channel: ${youtubeChannel.channelUrl}`
                        }
                        console.log(discordApiUrl)
                        postToDiscord(discordObj);
                    }
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function postToDiscord(json) {
      // Default options are marked with *
    const response = await fetch(discordApiUrl, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
        'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(json) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

setInterval(pollForLiveStreamData, 900000);




