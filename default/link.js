var utils = require('utils');

var utils = require('utils');
module.exports =
{
    run: function(link)
    {
        if (!utils.isLinkReceiver(link))
        {
            var receiver = link.room.find(FIND_MY_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return structure.structureType == STRUCTURE_LINK && utils.isLinkReceiver(structure);
                }
            });

            if (receiver.length > 0)
            {
                link.transferEnergy(receiver[0]);
            }
        }
    }
}