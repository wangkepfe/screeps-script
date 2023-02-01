module.exports =
{
    run: function(creep)
    {
        var words = 'M:';

        var sources = creep.room.find(FIND_SOURCES);
        var validSources = creep.pos.findInRange(FIND_SOURCES, 1);
        var validSource = null;

        if (validSources.length == 0)
        {
            for (var id in sources)
            {
                var source = sources[id];

                var creepsNearSource = source.pos.findInRange(FIND_CREEPS, 1);
                var linksNearSource = source.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: {structureType: STRUCTURE_LINK}});

                if (linksNearSource.length == 0 && creepsNearSource.length == 0)
                {
                    validSource = source;
                    break;
                }
            }
        }
        else
        {
            validSource = validSources[0];
        }

        if (validSource == null)
        {
            words += '👀';
            creep.say(words);
            return;
        }

        if (validSources.length == 0)
        {
            words += '🔄';
            creep.moveTo(validSource, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else
        {
            var returnCodeHarvest = creep.harvest(validSource);

            if (returnCodeHarvest == OK)
            {
                words += '⛏️';
            }
            else
            {
                words += '❓';
            }

            creep.memory.hasLink = false;
            var nearCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1);

            if (nearCreeps.length > 1)
            {
                var neighborCreep = nearCreeps[0];

                if (neighborCreep.pos == creep.pos)
                {
                    neighborCreep = nearCreeps[1];
                }

                var returnCodeTransfer = creep.transfer(neighborCreep, RESOURCE_ENERGY);

                if (returnCodeTransfer == OK)
                {
                    words += '⚡';
                }
                else
                {
                    words += '❓';
                }
            }
            else
            {
                words += '💤';
            }
        }

        creep.say(words);
    }
}