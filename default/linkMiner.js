module.exports =
{
    run: function(creep)
    {
        var words = 'L:';

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

                if (linksNearSource.length != 0 && creepsNearSource.length == 0)
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

            var links = validSource.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: {structureType: STRUCTURE_LINK}});

            if (links.length > 0)
            {
                var link = links[0];

                if (!creep.pos.inRangeTo(link, 1))
                {
                    words += '🔄';
                    creep.moveTo(link, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else
                {
                    var returnCodeTransfer = creep.transfer(link, RESOURCE_ENERGY);
                    if (returnCodeTransfer == OK)
                    {
                        words += '⚡';
                    }
                    else
                    {
                        words += '❓';
                    }
                }
            }
            else
            {
                words += '❌';
            }
        }

        creep.say(words);
    }
}