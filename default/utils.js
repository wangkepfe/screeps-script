module.exports = {
    bodyCost: function(body)
    {
        return body.reduce(function (cost, part)
        {
            return cost + BODYPART_COST[part];
        }, 0);
    },

    isLinkReceiver: function(link)
    {
        return link.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: {structureType: STRUCTURE_STORAGE}}).length > 0;
    },
};