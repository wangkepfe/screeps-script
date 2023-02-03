var utils = require('utils');
module.exports =
{
    run: function(creep)
    {
        var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if (sites.length == 0)
        {
            creep.say('B:💤');
            creep.memory.state = 2;
        }

        if (creep.memory.state == 0) // filling up from storage
        {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
            if (storages.length > 0)
            {
                var storage = storages[0];

                var returnCode = creep.withdraw(storage, RESOURCE_ENERGY);

                if (returnCode == ERR_NOT_IN_RANGE)
                {
                    creep.say('B:🔄');
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (returnCode == OK)
                {
                    creep.say('B:⛽');
                }
                else if (returnCode == ERR_NOT_ENOUGH_RESOURCES)
                {
                    creep.say('B:😭');
                }
                else if (returnCode == ERR_FULL)
                {
                    creep.say('B:👍');
                }
                else
                {
                    creep.say('B:❓1');
                }
            }

            if (creep.store.getFreeCapacity() == 0 || returnCode == ERR_FULL) // have enough
            {
                creep.memory.state = 1;
            }
        }
        else if (creep.memory.state == 1) // build!
        {
            var nearestSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

            if (nearestSite)
            {
                var returnCode = creep.build(nearestSite);

                if (returnCode == ERR_NOT_IN_RANGE)
                {
                    creep.say('B:🔄');
                    creep.moveTo(nearestSite, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (returnCode == OK)
                {
                    creep.say('B:⚡');
                }
                else if (returnCode == ERR_NOT_ENOUGH_RESOURCES)
                {
                    creep.say('B:😭');
                }
                else
                {
                    creep.say('B:❓2');
                }
            }
            else
            {
                creep.memory.state = 2;
                creep.say('B:💤');
            }

            if (creep.store.getFreeCapacity() == creep.store.getCapacity()) // empty
            {
                creep.memory.state = 0;
            }
        }
        else if (creep.memory.state == 2) // recycle
        {
            var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
            if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(spawn);
            }
        }
    },

    create: function(room, spawn)
    {
        let mybody = [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE];

        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'builder' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "builder",
                    state: 0,
                    ID: spawn.memory.creepID,
                    roomName: room.name
                }
            });
            spawn.memory.creepID++;
        }
    }
}