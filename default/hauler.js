var utils = require('utils');
module.exports =
{
    run: function(creep)
    {
        if (creep.memory.state == 0) // filling up from miner
        {
            var miners = creep.room.find(FIND_MY_CREEPS,
            {
                filter: (other) =>
                {
                    return other.memory.role == "miner" && other.memory.hasLink == false;
                }
            });

            if (miners.length > 0)
            {
                var miner = miners[0];
                if (!creep.pos.inRangeTo(miner, 1))
                {
                    creep.say('H:🔄');
                    creep.moveTo(miner, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else
                {
                    var containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: {structureType: STRUCTURE_CONTAINER}});
                    if (containers.length > 0)
                    {
                        creep.withdraw(containers[0], RESOURCE_ENERGY);
                        creep.say('H:⛽1');
                    }
                    else
                    {
                        creep.say('H:⛽2');
                    }
                }
            }
            else
            {
                creep.say('H:👀');
            }

            if (creep.store.getFreeCapacity() == 0) // full
            {
                creep.memory.state = 1;
            }
        }
        else if (creep.memory.state == 1) // dumping to storage
        {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});

            if (storages.length > 0)
            {
                var storage = storages[0];

                if (storage.store.getFreeCapacity() > 0)
                {
                    var returnCode = creep.transfer(storage, RESOURCE_ENERGY);

                    if (returnCode == ERR_NOT_IN_RANGE)
                    {
                        creep.say('H:🔄');
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else if (returnCode == OK)
                    {
                        creep.say('H:⚡');
                    }
                    else
                    {
                        creep.say('H:❓');
                    }
                }
                else
                {
                    creep.say('H:💤');
                }
            }
            else
            {
                var nearestspawnerOrExtensions = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                if (nearestspawnerOrExtensions)
                {
                    var returnCode = creep.transfer(nearestspawnerOrExtensions, RESOURCE_ENERGY);

                    if (returnCode == ERR_NOT_IN_RANGE)
                    {
                        creep.say('H:🔄');
                        creep.moveTo(nearestspawnerOrExtensions, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else if (returnCode == OK)
                    {
                        creep.say('H:⚡');
                    }
                    else
                    {
                        creep.say('H:❓');
                    }
                }
                else
                {
                    creep.say('H:💤');
                }
            }

            if (creep.store.getFreeCapacity() == creep.store.getCapacity()) // empty
            {
                creep.memory.state = 0;
            }
        }
    },

    create: function(room, spawn)
    {
        let mybody = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'hauler' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "hauler",
                    state: 0,
                    ID: spawn.memory.creepID,
                    roomName: room.name
                }
            });
            spawn.memory.creepID++;
        }
    }
}