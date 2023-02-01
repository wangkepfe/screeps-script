module.exports = {
    run: function(tower)
    {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if(closestHostile) {
            tower.attack(closestHostile);
        }
        else
        {
            var roadsNeedRepair = tower.room.find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax;
                    }
                });

            if (roadsNeedRepair.length > 0)
            {
                tower.repair(roadsNeedRepair[0]);
            }
        }

        tower.room.visual.text(tower.store[RESOURCE_ENERGY].toString() + '/' + tower.store.getCapacity(RESOURCE_ENERGY).toString(), tower.pos.x, tower.pos.y + 1.2, {align: 'center', opacity: 0.5});
    }
};