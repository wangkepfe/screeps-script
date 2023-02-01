module.exports =
{
    run: function(creep)
    {
        if (creep.memory.state == 0) // filling up from storage
        {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
            if (storages.length > 0)
            {
                var storage = storages[0];

                var returnCode = creep.withdraw(storage, RESOURCE_ENERGY);

                if (returnCode == ERR_NOT_IN_RANGE)
                {
                    creep.say('U:🔄');
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (returnCode == OK)
                {
                    creep.say('U:⛽');
                }
                else if (returnCode == ERR_NOT_ENOUGH_RESOURCES)
                {
                    creep.say('U:😭');
                }
                else
                {
                    creep.say('U:❓');
                }
            }

            if (creep.store.getFreeCapacity() == 0) // full
            {
                creep.memory.state = 1;
            }
        }
        else if (creep.memory.state == 1) // send to room controller
        {
            creep.say('U:⚡');

            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            if (creep.store.getFreeCapacity() == creep.store.getCapacity()) // empty
            {
                creep.memory.state = 0;
            }
        }
    }
}