module.exports =
{
    run: function(creep)
    {
        var energyNeeded = 0;

        if (creep.room.energyCapacityAvailable - creep.room.energyAvailable != 0)
        {
            energyNeeded = creep.room.energyCapacityAvailable - creep.room.energyAvailable;
        }
        else
        {
            var towers = creep.room.find(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (towers.length > 0)
            {
                for (var id in towers)
                {
                    var tower = towers[id];
                    energyNeeded += tower.store.getFreeCapacity(RESOURCE_ENERGY);
                }
            }
        }

        energyNeeded = Math.min(energyNeeded, creep.store.getCapacity());

        if (energyNeeded == 0)
        {
            var drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
            if (drops.length > 0)
            {
                creep.say('D:🟡');
                if (creep.pickup(drops[0]) != OK)
                {
                    creep.moveTo(drops[0]);
                }
            }
            else
            {
                creep.say('D:💤');
            }

            return;
        }

        if (creep.memory.state == 0) // filling up from storage
        {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
            if (storages.length > 0)
            {
                var storage = storages[0];

                var returnCode = creep.withdraw(storage, RESOURCE_ENERGY, energyNeeded);

                if (returnCode == ERR_NOT_IN_RANGE)
                {
                    creep.say('D:🔄');
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (returnCode == OK)
                {
                    creep.say('D:⛽');
                }
                else if (returnCode == ERR_NOT_ENOUGH_RESOURCES)
                {
                    creep.say('D:😭');
                }
                else if (returnCode == ERR_FULL)
                {
                    creep.say('D:👍');
                }
                else
                {
                    creep.say('D:❓1');
                }
            }

            if (creep.store.getUsedCapacity() >= energyNeeded || returnCode == ERR_FULL) // have enough
            {
                creep.memory.state = 1;
            }
        }
        else if (creep.memory.state == 1) // distribute to extensions and spawners and towers
        {
            var nearestspawnerOrExtensions = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            var nearestTower = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (nearestspawnerOrExtensions)
            {
                var returnCode = creep.transfer(nearestspawnerOrExtensions, RESOURCE_ENERGY);

                if (returnCode == ERR_NOT_IN_RANGE)
                {
                    creep.say('D:🔄');
                    creep.moveTo(nearestspawnerOrExtensions, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (returnCode == OK)
                {
                    creep.say('D:⚡');
                }
                else
                {
                    creep.say('D:❓2');
                }
            }
            else if (nearestTower)
            {
                var returnCode = creep.transfer(nearestTower, RESOURCE_ENERGY);

                if (returnCode == ERR_NOT_IN_RANGE)
                {
                    creep.say('D:🔄');
                    creep.moveTo(nearestTower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (returnCode == OK)
                {
                    creep.say('D:⚡');
                }
                else
                {
                    creep.say('D:❓3');
                }
            }
            else
            {
                creep.say('D:💤');
            }

            if (creep.store.getFreeCapacity() == creep.store.getCapacity()) // empty
            {
                creep.memory.state = 0;
            }
        }
    }
}