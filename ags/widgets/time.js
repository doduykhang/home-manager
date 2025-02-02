
const POLL_TIME = 60 * 1000

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, 
                                             hour: "numeric", 
                                             minute: "numeric"});
}

const time = Variable('', {
    poll: [POLL_TIME, getCurrentTime],
})

export { time }
