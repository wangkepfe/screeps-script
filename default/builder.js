module.exports =
{
    run: function(creep)
    {
        var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if (sites.length == 0)
        {
            creep.say('B:💤');
            return;
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
                creep.say('B:💤');
            }

            if (creep.store.getFreeCapacity() == creep.store.getCapacity()) // empty
            {
                creep.memory.state = 0;
            }
        }
    }
}