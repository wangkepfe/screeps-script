var utils = require('utils');

var utils = require('utils');
module.exports =
{
    run: function(creep)
    {
        var words = 'P:';

        var links = creep.room.find(FIND_MY_STRUCTURES,
        {
            filter: (structure) =>
            {
                return structure.structureType == STRUCTURE_LINK && utils.isLinkReceiver(structure);
            }
        });

        var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});

        if (links.length > 0 && storages.length > 0)
        {
            var link = links[0];
            var storage = storages[0];

            var closeToLink = creep.pos.inRangeTo(link, 1);
            var closeToStorage = creep.pos.inRangeTo(storage, 1);

            if (closeToLink && closeToStorage)
            {
                {
                    var returnCode = creep.withdraw(link, RESOURCE_ENERGY);

                    if (returnCode == ERR_NOT_IN_RANGE)
                    {
                        words += '⚠️';
                    }
                    else if (returnCode == OK)
                    {
                        words += '⛽';
                    }
                    else if (returnCode == ERR_NOT_ENOUGH_RESOURCES)
                    {
                        words += '💤';
                    }
                    else if (returnCode == ERR_FULL)
                    {
                        words += '😅';
                    }
                    else
                    {
                        words += '❓';
                    }
                }

                {
                    var returnCode = creep.transfer(storage, RESOURCE_ENERGY);

                    if (returnCode == ERR_NOT_IN_RANGE)
                    {
                        words += '⚠️';
                    }
                    else if (returnCode == OK)
                    {
                        words += '⚡';
                    }
                    else if (returnCode == ERR_NOT_ENOUGH_RESOURCES)
                    {
                        words += '💤';
                    }
                    else
                    {
                        words += '❓';
                    }
                }
            }
            else
            {
                var validPos;
                for (let i = 0; i < 9; i++)
                {
                    let x = i % 3 - 1;
                    let y = Math.floor(i / 3) - 1;
                    var linkPos = new RoomPosition(link.pos.x + x, link.pos.y + y, link.pos.roomName);
                    if (linkPos.inRangeTo(storage.pos, 1))
                    {
                        validPos = linkPos;
                        break;
                    }
                }
                creep.moveTo(validPos, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }

        // creep.say(words);
        creep.say('P:🔄');
    },

    create: function(room, spawn)
    {
        let mybody = [CARRY,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'passer' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "passer",
                    state: 0,
                    ID: spawn.memory.creepID,
                    roomName: room.name
                }
            });
            spawn.memory.creepID++;
        }
    }
}