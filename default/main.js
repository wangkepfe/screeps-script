var roomModule = require('room');
module.exports.loop = function ()
{
    for (var name in Memory.creeps)
    {
        if (!Game.creeps[name])
        {
            delete Memory.creeps[name];
        }
    }

    var myRooms = ['E37S4']

    roomModule.run('E37S4')

    if (0)
    {
        var statsConsole = require("statsConsole");
        let myStats = [
            // ["Creep Managers", CreepManagersCPUUsage],
        ];

        statsConsole.run(myStats);
        if ((Game.time % 5) === 0) {
            console.log(statsConsole.displayHistogram());
            console.log(statsConsole.displayStats());
            console.log(statsConsole.displayLogs());
        }
    }
}

